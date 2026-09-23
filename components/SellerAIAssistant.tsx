'use client'

import { useState } from 'react'
import { Sparkles, X, Send, Loader2, Briefcase } from 'lucide-react'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const WELCOME = {
  en: {
    title: 'Seller AI Assistant',
    subtitle: 'Your business advisor',
    examples: [
      'How should I price my products?',
      'Write a product description',
      'How to increase sales?',
      'Tips for better photos',
    ],
  },
  ur: {
    title: 'سیلر AI اسسٹنٹ',
    subtitle: 'آپ کا بزنس ایڈوائزر',
    examples: [
      'پروڈکٹ کی قیمت کیسے رکھوں؟',
      'پروڈکٹ ڈسکرپشن لکھیں',
      'سیلز کیسے بڑھاؤں؟',
      'بہتر تصاویر کے مشورے',
    ],
  },
}

export default function SellerAIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [language, setLanguage] = useState<'en' | 'ur'>('en')

  const t = WELCOME[language]

  const handleSend = async (e?: React.FormEvent, customQuery?: string) => {
    e?.preventDefault()
    const messageText = customQuery || query.trim()
    if (!messageText) return

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: 'user', content: messageText },
    ])
    setQuery('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai/seller-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
        },
      ])
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content:
            language === 'ur'
              ? 'معذرت، مسئلہ ہو گیا۔ دوبارہ کوشش کریں۔'
              : 'Sorry, something went wrong.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-6 z-50 w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all flex items-center justify-center group"
          title="Seller AI Assistant"
        >
          <Briefcase className="w-6 h-6 group-hover:rotate-12 transition" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border dark:border-slate-700 overflow-hidden flex flex-col max-h-[600px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold">{t.title}</p>
                  <p className="text-xs opacity-90">{t.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
                  className="p-1.5 hover:bg-white/20 rounded-lg text-xs font-bold"
                >
                  {language === 'en' ? 'UR' : 'EN'}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/20 rounded-lg"
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
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Briefcase className="w-8 h-8 text-blue-600 dark:text-blue-400" />
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
                      className="w-full text-left px-3 py-2 text-sm bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition border dark:border-slate-700"
                    >
                      {example}
                    </button>
                  ))}
                </div>
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
                          ? 'bg-blue-600 text-white rounded-br-sm'
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
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    </div>
                  </div>
                )}
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
                placeholder={
                  language === 'ur' ? 'بزنس کے بارے میں پوچھیں...' : 'Ask about your business...'
                }
                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
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
