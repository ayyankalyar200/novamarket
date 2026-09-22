'use client'

import { useState } from 'react'
import { AlertCircle, Loader2, CheckCircle, X } from 'lucide-react'

type Props = {
  isOpen: boolean
  onClose: () => void
  reportedUserId?: string
  reportedProductId?: string
  reportedName?: string
  type: 'product' | 'user'
}

const REASONS = [
  { value: 'counterfeit', label: 'Counterfeit or fake product' },
  { value: 'wrong_description', label: 'Description does not match' },
  { value: 'never_delivered', label: 'Product never delivered' },
  { value: 'damaged', label: 'Item arrived damaged' },
  { value: 'offensive', label: 'Offensive or inappropriate content' },
  { value: 'spam', label: 'Spam or misleading' },
  { value: 'harassment', label: 'Harassment or abuse' },
  { value: 'other', label: 'Other' },
]

export default function ReportModal({
  isOpen,
  onClose,
  reportedUserId,
  reportedProductId,
  reportedName,
  type,
}: Props) {
  const [reason, setReason] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!reason) {
      setError('Please select a reason')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reported_user_id: reportedUserId,
          reported_product_id: reportedProductId,
          reason,
          description,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit report')
      }

      setSuccess(true)
      setTimeout(() => {
        onClose()
        setSuccess(false)
        setReason('')
        setDescription('')
      }, 2500)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Report {type === 'product' ? 'Product' : 'User'}
              </h3>
              {reportedName && (
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                  {reportedName}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Success */}
        {success ? (
          <div className="p-8 text-center">
            <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Report Submitted
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Thank you! Our team will review your report.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Warning */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3">
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                ⚠️ False reports may result in account suspension. Please report only genuine issues.
              </p>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Why are you reporting this? *
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {REASONS.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setReason(r.value)}
                    className={`w-full text-left px-3 py-2 rounded-lg border-2 transition text-sm ${
                      reason === r.value
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:border-purple-500'
                        : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500'
                    }`}
                  >
                    <span className="text-gray-900 dark:text-white">
                      {r.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Additional details (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                maxLength={500}
                placeholder="Describe the issue in detail..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {description.length}/500
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-3">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 py-2.5 border-2 border-gray-300 dark:border-slate-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !reason}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    Submit Report
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
