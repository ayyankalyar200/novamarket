'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Props = {
  productId: string
  variant?: 'icon' | 'button'
  initialInWishlist?: boolean
}

export default function WishlistButton({
  productId,
  variant = 'icon',
  initialInWishlist = false,
}: Props) {
  const router = useRouter()
  const [inWishlist, setInWishlist] = useState(initialInWishlist)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check auth + initial wishlist state
  useEffect(() => {
    const check = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          setIsLoggedIn(false)
          setChecking(false)
          return
        }

        setIsLoggedIn(true)

        // Check if product is in wishlist
        const { data, error } = await supabase
          .from('wishlists')
          .select('id')
          .eq('user_id', user.id)
          .eq('product_id', productId)
          .maybeSingle()

        if (error) {
          console.error('Wishlist check error:', error)
        } else {
          setInWishlist(!!data)
        }
      } catch (err) {
        console.error('Wishlist check exception:', err)
      } finally {
        setChecking(false)
      }
    }
    check()
  }, [productId])

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isLoggedIn) {
      router.push('/login?redirect=' + window.location.pathname)
      return
    }

    setLoading(true)
    const wasInWishlist = inWishlist
    
    // Optimistic update
    setInWishlist(!wasInWishlist)

    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update wishlist')
      }

      // Confirm actual state from server
      setInWishlist(data.in_wishlist)
      router.refresh()
    } catch (err: any) {
      console.error('Wishlist toggle error:', err)
      // Revert on error
      setInWishlist(wasInWishlist)
      alert(err.message || 'Failed to update wishlist')
    } finally {
      setLoading(false)
    }
  }

  // Loading state
  if (checking) {
    if (variant === 'button') {
      return (
        <button
          disabled
          className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-white border-gray-300 text-gray-400"
        >
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-medium">Loading...</span>
        </button>
      )
    }
    return (
      <button
        disabled
        className="p-3 border rounded-lg bg-white border-gray-300"
        aria-label="Loading"
      >
        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
      </button>
    )
  }

  // Button variant
  if (variant === 'button') {
    return (
      <button
        onClick={toggleWishlist}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${
          inWishlist
            ? 'bg-red-50 border-red-300 text-red-600 dark:bg-red-900/20 dark:border-red-700'
            : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400 dark:bg-slate-800 dark:border-slate-600 dark:text-gray-200'
        } disabled:opacity-50`}
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
        )}
        <span className="font-medium">
          {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
        </span>
      </button>
    )
  }

  // Icon variant
  return (
    <button
      onClick={toggleWishlist}
      disabled={loading}
      className={`p-3 border rounded-lg transition disabled:opacity-50 ${
        inWishlist
          ? 'bg-red-50 border-red-300 dark:bg-red-900/20 dark:border-red-700'
          : 'bg-white border-gray-300 hover:bg-gray-50 dark:bg-slate-800 dark:border-slate-600 dark:hover:bg-slate-700'
      }`}
      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin text-red-500" />
      ) : (
        <Heart
          className={`w-5 h-5 transition ${
            inWishlist
              ? 'fill-current text-red-500'
              : 'text-gray-600 dark:text-gray-300'
          }`}
        />
      )}
    </button>
  )
}
