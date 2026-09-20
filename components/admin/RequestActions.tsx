'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X, Loader2 } from 'lucide-react'

export default function RequestActions({ requestId }: { requestId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  const handleApprove = async () => {
    setLoading('approve')
    try {
      const res = await fetch(`/api/admin/requests/${requestId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed')

      router.refresh()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(null)
    }
  }

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection')
      return
    }

    setLoading('reject')
    try {
      const res = await fetch(`/api/admin/requests/${requestId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject', reason: rejectReason }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed')

      router.refresh()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {!showRejectForm ? (
        <>
          <button
            onClick={handleApprove}
            disabled={!!loading}
            className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading === 'approve' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            Approve
          </button>
          <button
            onClick={() => setShowRejectForm(true)}
            disabled={!!loading}
            className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <X className="w-4 h-4" />
            Reject
          </button>
        </>
      ) : (
        <div className="w-full space-y-3">
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Reason for rejection..."
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowRejectForm(false)
                setRejectReason('')
              }}
              className="flex-1 py-2 border-2 border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              disabled={loading === 'reject'}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 text-sm font-medium flex items-center justify-center gap-2"
            >
              {loading === 'reject' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Confirm Reject'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
