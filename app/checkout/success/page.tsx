'use client'

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Package, ArrowRight, Loader2 } from 'lucide-react'

// ============================================
// INNER COMPONENT - uses useSearchParams
// ============================================
function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [confirming, setConfirming] = useState(true)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const confirmOrder = async () => {
      if (!sessionId) {
        setError('No session ID')
        setConfirming(false)
        return
      }

      try {
        const res = await fetch('/api/orders/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId }),
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Failed to confirm order')
        }

        setOrderId(data.order?.id || null)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setConfirming(false)
      }
    }

    confirmOrder()
  }, [sessionId])

  if (confirming) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <Loader2 className="w-16 h-16 text-purple-600 mx-auto mb-6 animate-spin" />
        <h1 className="text-3xl font-bold mb-3 text-gray-900">
          Confirming Payment...
        </h1>
        <p className="text-gray-500">Please wait while we confirm your order</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">⚠️</div>
        <h1 className="text-3xl font-bold mb-3 text-gray-900">
          Payment Received
        </h1>
        <p className="text-gray-500 mb-8">
          Your payment was successful, but we couldn't confirm the order
          automatically. Please check your orders page.
        </p>
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-medium"
        >
          <Package className="w-5 h-5" />
          View My Orders
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-14 h-14 text-green-600" />
      </div>

      <h1 className="text-4xl font-bold mb-3 text-gray-900">
        Payment Successful!
      </h1>
      <p className="text-gray-500 mb-8 text-lg">
        Thank you for your purchase. Your order has been confirmed.
      </p>

      <div className="bg-white rounded-lg border p-6 mb-8 text-left">
        <h2 className="font-bold mb-3 text-gray-900">
          What happens next?
        </h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-purple-600 mt-0.5">1.</span>
            <span>Seller will be notified about your order</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 mt-0.5">2.</span>
            <span>Product will be shipped within 1-3 business days</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 mt-0.5">3.</span>
            <span>You can track your order from My Orders page</span>
          </li>
        </ul>
      </div>

      <div className="flex gap-3 justify-center flex-wrap">
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-medium"
        >
          <Package className="w-5 h-5" />
          View My Orders
        </Link>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:border-purple-600 font-medium"
        >
          Continue Shopping
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  )
}

// ============================================
// MAIN PAGE - wraps in Suspense
// ============================================
export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <Loader2 className="w-16 h-16 text-purple-600 mx-auto mb-6 animate-spin" />
          <h1 className="text-3xl font-bold mb-3 text-gray-900">
            Loading...
          </h1>
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  )
}
