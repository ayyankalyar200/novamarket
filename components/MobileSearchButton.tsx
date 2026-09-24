'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Sparkles } from 'lucide-react'

export default function MobileSearchButton() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setIsOpen(false)
      setQuery('')
    }
  }

  const handleAISearch = () => {
    router.push(`/ai-search${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`)
    setIsOpen(false)
    setQuery('')
  }

  return (
    <>
      {/* Floating Search Button - Mobile Only */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 md:hidden w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all flex items-center justify-center"
        title="Search"
      >
        <Search className="w-6 h-6" />
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-start justify-center pt-20 px-4 md:hidden">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold dark:text-white">Search</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded"
              >
                <X className="w-5 h-5 dark:text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSearch} className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={!query.trim()}
                  className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Search
                </button>
                <button
                  type="button"
                  onClick={handleAISearch}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  AI Search
                </button>
              </div>
            </form>

            {/* Quick Links */}
            <div className="mt-4 pt-4 border-t dark:border-slate-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Trending</p>
              <div className="flex flex-wrap gap-2">
                {['Laptops', 'Shoes', 'Books', 'Watches'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      router.push(`/search?q=${tag}`)
                      setIsOpen(false)
                    }}
                    className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
