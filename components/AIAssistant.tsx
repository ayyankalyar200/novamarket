'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, X, Send, Loader2 } from 'lucide-react'

export default function AIAssistant() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setResponse('')

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query.trim() }),
      })

      const data = await res.json()
      setResponse(data.response || 'No response')
    } catch (err: any) {
      setResponse('Sorry, something went wrong. Please try again.')
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
          className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all flex items-center justify-center group"
          title="Nova AI - Your Shopping Assistant"
        >
          <Sparkles className="w-7 h-7 group-hover:rotate-12 transition" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border dark:border-slate-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold">Nova AI</p>
                  <p className="text-xs opacity-90">Your Shopping Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-4 max-h-[400px] overflow-y-auto">
            {!response && !loading && (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-bold mb-2 dark:text-white">
                  Hi! I'm Nova AI 👋
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Tell me what you're looking for and I'll find the perfect products
                </p>

                <div className="space-y-2">
                  {[
                    'Show me laptops under $1000',
                    'Best gifts for kids',
                    'Trending fashion items',
                  ].map((example) => (
                    <button
                      key={example}
                      onClick={() => setQuery(example)}
                      className="w-full text-left px-3 py-2 text-sm bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 transition"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {loading && (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Thinking...
                </p>
              </div>
            )}

            {response && !loading && (
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4">
                <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                  {response}
                </p>
                <div className="mt-3 pt-3 border-t dark:border-slate-600">
                  <button
                    onClick={() => router.push(`/ai-search?q=${encodeURIComponent(query)}`)}
                    className="text-xs text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    🔍 Find matching products →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSearch} className="p-3 border-t dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
