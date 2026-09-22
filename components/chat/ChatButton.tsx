'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MessageCircle, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Props = {
  sellerId: string
  productId?: string
  variant?: 'button' | 'link'
}

export default function ChatButton({
  sellerId,
  productId,
  variant = 'button',
}: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      if (user.id === sellerId) {
        alert("You can't message yourself")
        setLoading(false)
        return
      }

      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seller_id: sellerId,
          product_id: productId,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed')
      }

      router.push(`/messages/${data.conversation_id}`)
    } catch (err: any) {
      alert(err.message)
      setLoading(false)
    }
  }

  if (variant === 'link') {
    return (
      <button
        onClick={handleClick}
        disabled={loading}
        className="text-sm text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <MessageCircle className="w-3 h-3" />
        )}
        Contact Seller
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium transition"
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <MessageCircle className="w-5 h-5" />
      )}
      Chat with Seller
    </button>
  )
}
