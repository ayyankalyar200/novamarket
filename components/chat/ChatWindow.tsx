'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, Loader2, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Message = {
  id: string
  sender_id: string
  content: string
  created_at: string
}

type Props = {
  conversationId: string
  currentUserId: string
  otherUser: {
    id: string
    username: string
    avatar_url?: string
    is_online?: boolean
    last_active?: string
  }
  initialMessages: Message[]
  initialOtherLastActive?: string
}

export default function ChatWindow({
  conversationId,
  currentUserId,
  otherUser,
  initialMessages,
  initialOtherLastActive,
}: Props) {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [otherOnline, setOtherOnline] = useState(false)
  const [otherLastActive, setOtherLastActive] = useState(initialOtherLastActive || '')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabaseRef = useRef<any>(null)

  // Initialize Supabase once
  useEffect(() => {
    supabaseRef.current = createClient()
  }, [])

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // ⚡ REALTIME SUBSCRIPTION — FAST
  useEffect(() => {
    if (!supabaseRef.current) return

    const supabase = supabaseRef.current

    // Subscribe to new messages
    const channel = supabase
      .channel(`chat-${conversationId}`, {
        config: {
          broadcast: { self: true },
        },
      })
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload: any) => {
          console.log('⚡ New message:', payload.new)
          const newMsg = payload.new as Message
          setMessages((prev) => {
            // Avoid duplicates
            if (prev.some((m) => m.id === newMsg.id)) return prev
            return [...prev, newMsg]
          })
        }
      )
      .subscribe((status: string) => {
        console.log('📡 Chat subscription:', status)
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId])

  // ⚡ Track user activity (send heartbeat)
  useEffect(() => {
    if (!supabaseRef.current || !currentUserId) return
    const supabase = supabaseRef.current

    const updateActivity = async () => {
      await supabase
        .from('profiles')
        .update({ last_active_at: new Date().toISOString() })
        .eq('id', currentUserId)
    }

    updateActivity()
    const interval = setInterval(updateActivity, 30000) // Every 30 sec
    return () => clearInterval(interval)
  }, [currentUserId])

  // ⚡ Check other user's online status
  useEffect(() => {
    if (!supabaseRef.current || !otherUser.id) return
    const supabase = supabaseRef.current

    const checkOnline = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('last_active_at')
        .eq('id', otherUser.id)
        .single()

      if (data?.last_active_at) {
        const diff = Date.now() - new Date(data.last_active_at).getTime()
        const isOnline = diff < 2 * 60 * 1000 // 2 minutes
        setOtherOnline(isOnline)
        setOtherLastActive(data.last_active_at)
      }
    }

    checkOnline()
    const interval = setInterval(checkOnline, 20000) // Every 20 sec
    return () => clearInterval(interval)
  }, [otherUser.id])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    setSending(true)
    const content = newMessage.trim()
    setNewMessage('')

    // ⚡ Optimistic update — show immediately
    const tempId = `temp-${Date.now()}`
    const optimisticMsg: Message = {
      id: tempId,
      sender_id: currentUserId,
      content,
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, optimisticMsg])

    try {
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversationId,
          content,
        }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      // Replace optimistic with real
      if (data.message) {
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? data.message : m))
        )
      }
    } catch (err: any) {
      alert(err.message || 'Failed to send')
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((m) => m.id !== tempId))
      setNewMessage(content)
    } finally {
      setSending(false)
    }
  }

  const formatTime = (date: string) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)

    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    if (hours < 24) return `${hours}h ago`
    return d.toLocaleDateString()
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
        <Link
          href="/messages"
          className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5 dark:text-white" />
        </Link>
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
            {otherUser.username[0].toUpperCase()}
          </div>
          {otherOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800" />
          )}
        </div>
        <div>
          <p className="font-bold dark:text-white">{otherUser.username}</p>
          <p className={`text-xs ${otherOnline ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
            {otherOnline ? '● Online' : otherLastActive ? `Last seen ${formatTime(otherLastActive)}` : 'Offline'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMine = msg.sender_id === currentUserId
            const isTemp = msg.id.startsWith('temp-')
            return (
              <div
                key={msg.id}
                className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    isMine
                      ? `bg-purple-600 text-white rounded-br-sm ${isTemp ? 'opacity-70' : ''}`
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm break-words whitespace-pre-wrap">
                    {msg.content}
                  </p>
                  <p
                    className={`text-[10px] mt-1 ${
                      isMine
                        ? 'text-purple-200'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {isTemp ? 'Sending...' : formatTime(msg.created_at)}
                  </p>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="p-3 border-t dark:border-slate-700 bg-gray-50 dark:bg-slate-900"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-800 dark:text-white"
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
