'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, Search, Loader2, Package, ArrowRight } from 'lucide-react'

const EXAMPLE_QUERIES = [
  'I need a laptop for programming under $900',
  'Wireless headphones with good bass',
  'Gift for a 5 year old birthday',
  'Running shoes for marathon training',
  'Best camera for travel photography',
]

export default function AISearchPage() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError('')
    setSearched(false)

    try {
      const res = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Search failed')
      }

      setResults(data.results || [])
      setSearched(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleExampleClick = (example: string) => {
    setQuery(example)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full mb-4">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">AI-Powered Search</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
          Describe what you want
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Just tell us what you're looking for — our AI will find the perfect products
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. I need a laptop for programming under $900"
            className="w-full pl-12 pr-32 py-4 text-lg border-2 border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 text-white px-6 py-2.5 rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Search
              </>
            )}
          </button>
        </div>
      </form>

      {/* Example Queries */}
      {!searched && !loading && (
        <div className="mb-10">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 text-center">
            Try one of these:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {EXAMPLE_QUERIES.map((example) => (
              <button
                key={example}
                onClick={() => handleExampleClick(example)}
                className="px-4 py-2 text-sm bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-300 transition"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700 overflow-hidden animate-pulse"
            >
              <div className="aspect-square bg-gray-200 dark:bg-slate-700" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded" />
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {!loading && searched && results.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              ✨ AI Found {results.length} Products
            </h2>
            <Link
              href="/products"
              className="text-purple-600 hover:underline text-sm font-medium flex items-center gap-1"
            >
              Browse all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {results.map((product: any) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700 overflow-hidden hover:shadow-lg transition group"
              >
                <div className="aspect-square bg-gray-100 dark:bg-slate-700 overflow-hidden">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">
                      📦
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm line-clamp-2 mb-1 min-h-[2.5rem] dark:text-white">
                    {product.title}
                  </h3>
                  <p className="text-purple-600 font-bold text-lg">
                    ${product.price}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    by {product.profiles?.username || 'Seller'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading && searched && results.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border-2 border-dashed dark:border-slate-700">
          <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
            No products found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Try a different description
          </p>
          <Link
            href="/products"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-medium"
          >
            Browse All Products
          </Link>
        </div>
      )}
    </div>
  )
}
