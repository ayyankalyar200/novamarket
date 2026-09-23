'use client'

import { useState } from 'react'
import { Tag, Check, X, Loader2 } from 'lucide-react'

type Props = {
  subtotal: number
  onApply: (coupon: any, discount: number) => void
  onRemove: () => void
  appliedCoupon?: any
}

export default function CouponInput({
  subtotal,
  onApply,
  onRemove,
  appliedCoupon,
}: Props) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim(),
          subtotal,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Invalid coupon')
      }

      setSuccess(`Coupon applied! You save $${data.discount.toFixed(2)}`)
      onApply(data.coupon, data.discount)
      setCode('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = () => {
    onRemove()
    setSuccess('')
    setError('')
    setCode('')
  }

  // Applied state
  if (appliedCoupon) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-300">
                {appliedCoupon.code}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400">
                {appliedCoupon.description || 'Discount applied'}
              </p>
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="p-1 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-full"
          >
            <X className="w-4 h-4 text-green-700 dark:text-green-400" />
          </button>
        </div>
      </div>
    )
  }

  // Input state
  return (
    <div className="space-y-2">
      <form onSubmit={handleApply} className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Coupon code"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 uppercase"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center gap-1"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            'Apply'
          )}
        </button>
      </form>

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded">
          <X className="w-3 h-3" />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-2 rounded">
          <Check className="w-3 h-3" />
          {success}
        </div>
      )}
    </div>
  )
}
