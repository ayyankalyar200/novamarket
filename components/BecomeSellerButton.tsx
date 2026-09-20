'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Store, Loader2, Check, X, Sparkles, TrendingUp, DollarSign, Users } from 'lucide-react'

export default function BecomeSellerButton() {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleBecomeSeller = async () => {
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/become-seller', {
        method: 'POST',
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to become seller')
      }

      setSuccess(true)

      setTimeout(() => {
        setShowModal(false)
        router.push('/dashboard/seller')
        router.refresh()
      }, 2000)
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center">
        <Check className="w-12 h-12 text-green-600 mx-auto mb-3" />
        <h3 className="font-bold text-lg text-green-800 mb-1">You're a Seller!</h3>
        <p className="text-sm text-green-700">Redirecting to your dashboard...</p>
      </div>
    )
  }

  return (
    <>
      {/* Big Prominent Button */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="bg-white/20 p-3 rounded-lg">
            <Store className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">Start Selling on NovaMarket</h3>
            <p className="text-sm opacity-90 mb-4">
              Turn your passion into profit. List products for free and reach buyers worldwide.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Become a Seller
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white rounded-t-2xl">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-2">
                <Store className="w-8 h-8" />
                <h2 className="text-2xl font-bold">Become a Seller</h2>
              </div>
              <p className="opacity-90 text-sm">
                Start earning money by selling products on NovaMarket
              </p>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="font-bold text-lg mb-4">Why become a seller?</h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Earn Money</p>
                    <p className="text-xs text-gray-500">
                      Sell products and get paid directly via Stripe
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Reach Millions</p>
                    <p className="text-xs text-gray-500">
                      Access a global marketplace of buyers
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Free Analytics</p>
                    <p className="text-xs text-gray-500">
                      Track sales, revenue, and performance
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-orange-100 p-2 rounded-lg flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Free to Start</p>
                    <p className="text-xs text-gray-500">
                      No upfront fees. Only 5% commission on sales.
                    </p>
                  </div>
                </div>
              </div>

              {/* Info box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                <p className="text-xs text-blue-800">
                  <strong>Note:</strong> You can still buy products as usual. 
                  Becoming a seller adds selling features to your account.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg border border-red-200 text-sm mb-4">
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                  className="flex-1 py-3 border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBecomeSeller}
                  disabled={loading}
                  className="flex-1 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Store className="w-4 h-4" />
                      Yes, Become a Seller
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
