'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Tag,
  Plus,
  Loader2,
  Check,
  X,
  Copy,
  Calendar,
  TrendingUp,
  Percent,
  DollarSign,
} from 'lucide-react'

export default function SellerCouponsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [coupons, setCoupons] = useState<any[]>([])
  const [copied, setCopied] = useState<string | null>(null)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    code: '',
    description: '',
    discount_type: 'percentage',
    discount_value: '',
    min_purchase_amount: '0',
    max_discount_amount: '',
    usage_limit: '',
    expires_at: '',
  })

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data } = await supabase
        .from('coupons')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false })

      setCoupons(data || [])
      setLoading(false)
    }
    load()
  }, [router])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setCreating(true)

    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          discount_value: parseFloat(form.discount_value),
          min_purchase_amount: parseFloat(form.min_purchase_amount) || 0,
          max_discount_amount: form.max_discount_amount ? parseFloat(form.max_discount_amount) : null,
          usage_limit: form.usage_limit ? parseInt(form.usage_limit) : null,
          expires_at: form.expires_at || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      setCoupons((prev) => [data.coupon, ...prev])
      setShowForm(false)
      setForm({
        code: '',
        description: '',
        discount_type: 'percentage',
        discount_value: '',
        min_purchase_amount: '0',
        max_discount_amount: '',
        usage_limit: '',
        expires_at: '',
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setCreating(false)
    }
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(code)
    setTimeout(() => setCopied(null), 2000)
  }

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = 'NOVA-'
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setForm({ ...form, code })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white flex items-center gap-3">
            <Tag className="w-8 h-8 text-purple-600" />
            Coupons
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Create discount codes to boost your sales
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-600 text-white px-4 py-2.5 rounded-lg hover:bg-purple-700 font-medium flex items-center gap-2"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Create Coupon'}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 p-6 mb-6"
        >
          <h2 className="font-bold text-lg mb-4 dark:text-white">New Coupon</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Code */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 dark:text-white">
                Coupon Code *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  required
                  placeholder="SAVE20"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg uppercase"
                />
                <button
                  type="button"
                  onClick={generateRandomCode}
                  className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 text-sm font-medium"
                >
                  🎲 Random
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 dark:text-white">
                Description
              </label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="e.g. Summer sale discount"
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-white">
                Discount Type *
              </label>
              <select
                value={form.discount_type}
                onChange={(e) => setForm({ ...form, discount_type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>

            {/* Value */}
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-white">
                Discount Value *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.discount_value}
                onChange={(e) => setForm({ ...form, discount_value: e.target.value })}
                required
                placeholder={form.discount_type === 'percentage' ? '20' : '10.00'}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg"
              />
            </div>

            {/* Min Purchase */}
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-white">
                Minimum Purchase ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.min_purchase_amount}
                onChange={(e) => setForm({ ...form, min_purchase_amount: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg"
              />
            </div>

            {/* Max Discount */}
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-white">
                Max Discount ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.max_discount_amount}
                onChange={(e) => setForm({ ...form, max_discount_amount: e.target.value })}
                placeholder="Optional"
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg"
              />
            </div>

            {/* Usage Limit */}
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-white">
                Usage Limit
              </label>
              <input
                type="number"
                min="1"
                value={form.usage_limit}
                onChange={(e) => setForm({ ...form, usage_limit: e.target.value })}
                placeholder="Unlimited"
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg"
              />
            </div>

            {/* Expiry */}
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-white">
                Expires At
              </label>
              <input
                type="datetime-local"
                value={form.expires_at}
                onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg border border-red-200 dark:border-red-700 mt-4">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={creating}
            className="mt-4 w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
          >
            {creating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Create Coupon
              </>
            )}
          </button>
        </form>
      )}

      {/* Coupons List */}
      {coupons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coupons.map((coupon) => {
            const isExpired = coupon.expires_at && new Date(coupon.expires_at) < new Date()
            const isUsedUp = coupon.usage_limit && coupon.usage_count >= coupon.usage_limit
            const isActive = coupon.is_active && !isExpired && !isUsedUp

            return (
              <div
                key={coupon.id}
                className={`bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 p-5 ${
                  !isActive ? 'opacity-60' : ''
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <button
                        onClick={() => copyCode(coupon.code)}
                        className="font-mono font-bold text-lg dark:text-white hover:text-purple-600 flex items-center gap-2"
                      >
                        {coupon.code}
                        {copied === coupon.code ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {coupon.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {coupon.description}
                      </p>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                    isActive
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : isExpired
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      : isUsedUp
                      ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-400'
                  }`}>
                    {isActive ? 'ACTIVE' : isExpired ? 'EXPIRED' : isUsedUp ? 'USED UP' : 'INACTIVE'}
                  </span>
                </div>

                {/* Discount */}
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-3 text-white mb-3">
                  <div className="flex items-center gap-2">
                    {coupon.discount_type === 'percentage' ? (
                      <Percent className="w-5 h-5" />
                    ) : (
                      <DollarSign className="w-5 h-5" />
                    )}
                    <span className="text-2xl font-bold">
                      {coupon.discount_type === 'percentage' 
                        ? `${coupon.discount_value}%` 
                        : `$${coupon.discount_value}`}
                    </span>
                    <span className="text-sm opacity-90">OFF</span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1.5 text-xs">
                  {coupon.min_purchase_amount > 0 && (
                    <p className="text-gray-600 dark:text-gray-400">
                      Min purchase: <span className="font-medium">${coupon.min_purchase_amount}</span>
                    </p>
                  )}
                  <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <TrendingUp className="w-3 h-3" />
                    Used: <span className="font-medium">{coupon.usage_count}</span>
                    {coupon.usage_limit && <span>/ {coupon.usage_limit}</span>}
                  </p>
                  {coupon.expires_at && (
                    <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      Expires: {new Date(coupon.expires_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl border-2 border-dashed dark:border-slate-700">
          <Tag className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
            No coupons yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Create your first coupon to start offering discounts
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-medium inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Coupon
          </button>
        </div>
      )}
    </div>
  )
}
