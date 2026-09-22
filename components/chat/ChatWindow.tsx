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
  }
  initialMessages: Message[]
}

export default function ChatWindow({
  conversationId,
  currentUserId,
  otherUser,
  initialMessages,
}: Props) {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom on load and new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Realtime subscription
  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel(`conversation-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) => {
            // Avoid duplicates
            if (prev.find((m) => m.id === payload.new.id)) return prev
            return [...prev, payload.new as Message]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    setSending(true)
    const content = newMessage.trim()
    setNewMessage('')

    try {
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversationId,
          content,
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to send')
      }

      // Message will arrive via realtime subscription
    } catch (err) {
      alert('Failed to send message')
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
    const days = Math.floor(diff / 86400000)

    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
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
        <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
          {otherUser.username[0].toUpperCase()}
        </div>
        <div>
          <p className="font-bold dark:text-white">{otherUser.username}</p>
          <p className="text-xs text-green-600 dark:text-green-400">
            ● Online
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
            return (
              <div
                key={msg.id}
                className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    isMine
                      ? 'bg-purple-600 text-white rounded-br-sm'
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
                    {formatTime(msg.created_at)}
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
