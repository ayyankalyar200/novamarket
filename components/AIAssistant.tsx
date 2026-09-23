'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, X, Send, Loader2, Languages } from 'lucide-react'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const WELCOME_MESSAGES = {
  en: {
    title: "Hi! I'm Nova AI 👋",
    subtitle: "Your personal shopping assistant",
    examples: [
      'Show me laptops under $1000',
      'Best gifts for kids',
      'Trending fashion items',
    ],
  },
  ur: {
    title: 'السلام علیکم! میں نووا AI ہوں 👋',
    subtitle: 'آپ کا ذاتی شاپنگ اسسٹنٹ',
    examples: [
      'مجھے $1000 سے کم لیپ ٹاپ چاہیے',
      'بچوں کے لیے بہترین تحفے',
      'مشہور فیشن آئٹمز',
    ],
  },
}

export default function AIAssistant() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [language, setLanguage] = useState<'en' | 'ur'>('en')
  const [userId, setUserId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Check user
  useEffect(() => {
    const checkAuth = async () => {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id || null)
    }
    checkAuth()
  }, [])

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const t = WELCOME_MESSAGES[language]

  const handleSend = async (e?: React.FormEvent, customQuery?: string) => {
    e?.preventDefault()
    const messageText = customQuery || query.trim()
    if (!messageText) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setQuery('')
    setLoading(true)

    try {
      const history = messages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      }))

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          history,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'AI failed')
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content:
            language === 'ur'
              ? 'معذرت، کچھ مسئلہ ہو گیا۔ دوبارہ کوشش کریں۔'
              : 'Sorry, something went wrong. Please try again.',
          timestamp: new Date(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (productQuery: string) => {
    router.push(`/ai-search?q=${encodeURIComponent(productQuery)}`)
    setIsOpen(false)
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all flex items-center justify-center group"
          title="Nova AI Assistant"
        >
          <Sparkles className="w-7 h-7 group-hover:rotate-12 transition" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border dark:border-slate-700 overflow-hidden flex flex-col max-h-[600px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold">Nova AI</p>
                  <p className="text-xs opacity-90">
                    {language === 'ur' ? 'آپ کا شاپنگ اسسٹنٹ' : 'Your Shopping Assistant'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition"
                  title={language === 'en' ? 'اردو' : 'English'}
                >
                  <Languages className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-slate-900">
            {messages.length === 0 && !loading ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-bold mb-1 dark:text-white">{t.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {t.subtitle}
                </p>

                <div className="space-y-2">
                  {t.examples.map((example) => (
                    <button
                      key={example}
                      onClick={() => handleSend(undefined, example)}
                      className="w-full text-left px-3 py-2 text-sm bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 transition border dark:border-slate-700"
                    >
                      {example}
                    </button>
                  ))}
                </div>

                {userId && (
                  <button
                    onClick={() => handleSearch(messages[messages.length - 1]?.content || '')}
                    className="mt-4 text-xs text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    🔍 {language === 'ur' ? 'مکمل سرچ کریں' : 'Full AI Search'}
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3 py-2 ${
                        msg.role === 'user'
                          ? 'bg-purple-600 text-white rounded-br-sm'
                          : 'bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-bl-sm border dark:border-slate-700'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-bl-sm px-3 py-2 border dark:border-slate-700">
                      <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="p-3 border-t dark:border-slate-700 bg-white dark:bg-slate-800 flex-shrink-0"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={language === 'ur' ? 'کچھ پوچھیں...' : 'Ask me anything...'}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
