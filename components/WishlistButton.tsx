'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'
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
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setIsLoggedIn(!!user)

      if (user && !initialInWishlist) {
        const { data } = await supabase
          .from('wishlists')
          .select('id')
          .eq('user_id', user.id)
          .eq('product_id', productId)
          .single()
        setInWishlist(!!data)
      }
    }
    checkAuth()
  }, [productId, initialInWishlist])

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isLoggedIn) {
      router.push('/login')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId }),
      })

      const data = await res.json()

      if (res.ok) {
        setInWishlist(data.in_wishlist)
        router.refresh()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (variant === 'button') {
    return (
      <button
        onClick={toggleWishlist}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${
          inWishlist
            ? 'bg-red-50 border-red-300 text-red-600'
            : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
        }`}
      >
        <Heart
          className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`}
        />
        <span className="font-medium">
          {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
        </span>
      </button>
    )
  }

  return (
    <button
      onClick={toggleWishlist}
      disabled={loading}
      className={`p-3 border rounded-lg transition ${
        inWishlist
          ? 'bg-red-50 border-red-300'
          : 'bg-white border-gray-300 hover:bg-gray-50'
      }`}
      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        className={`w-5 h-5 transition ${
          inWishlist ? 'fill-current text-red-500' : 'text-gray-600'
        }`}
      />
    </button>
  )
}
