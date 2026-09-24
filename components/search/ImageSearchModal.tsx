'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import {
  Camera,
  Upload,
  X,
  Loader2,
  Sparkles,
  Package,
  ArrowRight,
} from 'lucide-react'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export default function ImageSearchModal({ isOpen, onClose }: Props) {
  const [isDragging, setIsDragging] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [keywords, setKeywords] = useState<string[]>([])
  const [results, setResults] = useState<any[]>([])
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((file: File) => {
    // Validate
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image too large. Max 5MB')
      return
    }

    setError('')
    setImageFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setResults([])
    setKeywords([])
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleSearch = async () => {
    if (!imageFile) return

    setLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('image', imageFile)

      const res = await fetch('/api/ai/image-search', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Search failed')
      }

      setKeywords(data.keywords || [])
      setResults(data.results || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setImageFile(null)
    setPreviewUrl(null)
    setResults([])
    setKeywords([])
    setError('')
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-2 rounded-lg">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg dark:text-white">
                Search with Image
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                AI finds products similar to your image
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
          >
            <X className="w-5 h-5 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* Upload Area */}
          {!previewUrl ? (
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer transition ${
                isDragging
                  ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30'
                  : 'border-gray-300 dark:border-slate-600 hover:border-purple-500 hover:bg-gray-50 dark:hover:bg-slate-700/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2 dark:text-white">
                Drop image here
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                or click to browse
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-400">
                <span className="px-2 py-1 bg-gray-100 dark:bg-slate-700 rounded">
                  JPG
                </span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-slate-700 rounded">
                  PNG
                </span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-slate-700 rounded">
                  WebP
                </span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-slate-700 rounded">
                  Max 5MB
                </span>
              </div>
            </div>
          ) : (
            <div>
              {/* Image Preview */}
              <div className="relative bg-gray-100 dark:bg-slate-900 rounded-2xl overflow-hidden mb-4">
                <img
                  src={previewUrl}
                  alt="Search preview"
                  className="w-full max-h-[400px] object-contain mx-auto"
                />
                <button
                  onClick={handleReset}
                  className="absolute top-3 right-3 p-2 bg-black/60 text-white rounded-full hover:bg-black/80"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search Button */}
              {results.length === 0 && !loading && (
                <button
                  onClick={handleSearch}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg hover:opacity-90 font-medium flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Search with AI
                </button>
              )}

              {/* Loading */}
              {loading && (
                <div className="text-center py-8">
                  <Loader2 className="w-10 h-10 animate-spin text-purple-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Analyzing image with AI...
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-3 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Keywords */}
          {keywords.length > 0 && (
            <div className="mt-6">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                AI detected:
              </p>
              <div className="flex flex-wrap gap-2">
                {keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {results.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold dark:text-white">
                  {results.length} Similar Products Found
                </h3>
                <button
                  onClick={handleReset}
                  className="text-xs text-purple-600 hover:underline"
                >
                  Try another image
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {results.map((p: any) => (
                  <Link
                    key={p.id}
                    href={`/product/${p.id}`}
                    onClick={onClose}
                    className="bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700 overflow-hidden hover:shadow-lg transition group"
                  >
                    <div className="aspect-square bg-gray-100 dark:bg-slate-700 overflow-hidden">
                      {p.images?.[0] ? (
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl">
                          📦
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <h4 className="text-xs font-medium line-clamp-2 mb-1 min-h-[2rem] dark:text-white">
                        {p.title}
                      </h4>
                      <p className="text-sm font-bold text-purple-600">
                        ${p.price}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
