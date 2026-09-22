'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Check,
  X,
  Ban,
  Loader2,
  Eye,
  Package,
  EyeOff,
  Undo2,
} from 'lucide-react'

type Props = {
  reportId: string
  reportedUserId?: string | null
  reportedProductId?: string | null
  isProductHidden?: boolean
}

export default function ReportActions({
  reportId,
  reportedUserId,
  reportedProductId,
  isProductHidden = false,
}: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [showReasonInput, setShowReasonInput] = useState(false)
  const [reason, setReason] = useState('')

  const handleAction = async (action: string, customReason?: string) => {
    setLoading(action)

    try {
      const res = await fetch(`/api/admin/reports/${reportId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, reason: customReason }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed')
      }

      setShowReasonInput(false)
      setReason('')
      router.refresh()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-3 pt-3 border-t dark:border-slate-700">
      {/* Reason input (expandable) */}
      {showReasonInput && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3">
          <label className="block text-xs font-medium mb-2 text-yellow-800 dark:text-yellow-200">
            Reason (optional but recommended):
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            placeholder="e.g. Counterfeit product, misleading description..."
            className="w-full px-3 py-2 border border-yellow-300 dark:border-yellow-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => handleAction('hide_product', reason)}
              disabled={!!loading}
              className="flex-1 py-2 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-1"
            >
              {loading === 'hide_product' ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <EyeOff className="w-3 h-3" />
              )}
              Confirm Hide
            </button>
            <button
              onClick={() => {
                setShowReasonInput(false)
                setReason('')
              }}
              className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-xs font-medium hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        {/* View Product */}
        {reportedProductId && (
          <Link
            href={`/product/${reportedProductId}`}
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs font-medium"
          >
            <Eye className="w-3.5 h-3.5" />
            View Product
          </Link>
        )}

        {/* View Seller */}
        {reportedUserId && (
          <Link
            href={`/products?seller=${reportedUserId}`}
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-xs font-medium"
          >
            <Package className="w-3.5 h-3.5" />
            View Seller
          </Link>
        )}

        {/* Hide Product (Soft Delete) */}
        {reportedProductId && !isProductHidden && !showReasonInput && (
          <button
            onClick={() => setShowReasonInput(true)}
            disabled={!!loading}
            className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs font-medium disabled:opacity-50"
            title="Product will be hidden from buyers (not deleted)"
          >
            <EyeOff className="w-3.5 h-3.5" />
            Hide Product
          </button>
        )}

        {/* Unhide Product */}
        {reportedProductId && isProductHidden && (
          <button
            onClick={() => handleAction('unhide_product')}
            disabled={!!loading}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs font-medium disabled:opacity-50"
          >
            {loading === 'unhide_product' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Undo2 className="w-3.5 h-3.5" />
            )}
            Unhide Product
          </button>
        )}

        {/* Ban User */}
        {reportedUserId && (
          <button
            onClick={() => {
              if (
                confirm(
                  'Ban this user?\n\nThey will not be able to log in or sell.'
                )
              ) {
                handleAction('ban_user')
              }
            }}
            disabled={!!loading}
            className="flex items-center gap-2 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-xs font-medium disabled:opacity-50"
          >
            {loading === 'ban_user' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Ban className="w-3.5 h-3.5" />
            )}
            Ban User
          </button>
        )}

        {/* Resolve */}
        <button
          onClick={() => handleAction('resolve')}
          disabled={!!loading}
          className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs font-medium disabled:opacity-50"
        >
          {loading === 'resolve' ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Check className="w-3.5 h-3.5" />
          )}
          Resolve
        </button>

        {/* Dismiss */}
        <button
          onClick={() => handleAction('dismiss')}
          disabled={!!loading}
          className="flex items-center gap-2 px-3 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 text-xs font-medium disabled:opacity-50"
        >
          {loading === 'dismiss' ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <X className="w-3.5 h-3.5" />
          )}
          Dismiss
        </button>
      </div>

      {/* Info */}
      {reportedProductId && !isProductHidden && (
        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
          💡 <strong>Hide</strong> karne se product buyers ko nahi dikhega, lekin data safe rahega
        </p>
      )}
    </div>
  )
}
