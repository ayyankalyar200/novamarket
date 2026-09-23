'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '@/lib/cart-context'
import { Trash2, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react'
import CouponInput from '@/components/coupons/CouponInput'

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart()
  const [checkingOut, setCheckingOut] = useState(false)
  const [coupon, setCoupon] = useState<any>(null)
  const [discount, setDiscount] = useState(0)
  const [error, setError] = useState('')

  const handleCheckout = async () => {
    setCheckingOut(true)
    setError('')

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Checkout failed')
      }

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (err: any) {
      setError(err.message)
      setCheckingOut(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-8xl mb-6">🛒</div>
        <h1 className="text-3xl font-bold mb-3 text-gray-900">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">Start shopping to add items to your cart</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-medium"
        >
          <ShoppingBag className="w-5 h-5" />
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">
        Shopping Cart ({totalItems} item{totalItems !== 1 ? 's' : ''})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border p-4 flex gap-4"
            >
              <Link href={`/product/${item.id}`} className="flex-shrink-0">
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl">
                      📦
                    </div>
                  )}
                </div>
              </Link>

              <div className="flex-1 min-w-0">
                <Link
                  href={`/product/${item.id}`}
                  className="font-medium text-gray-900 hover:text-purple-600 line-clamp-2"
                >
                  {item.title}
                </Link>
                <p className="text-purple-600 font-bold text-lg mt-1">
                  ${item.price}
                </p>

                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="px-3 py-1 border-x min-w-[2.5rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-500">Subtotal</p>
                <p className="font-bold text-lg">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border p-6 sticky top-32">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Order Summary</h2>

            <div className="space-y-3 mb-4 pb-4 border-b">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">$${(totalPrice - discount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">$0.00</span>
              </div>
            </div>

            {/* Coupon */}
            <div className="mb-4 pb-4 border-b">
              <CouponInput
                subtotal={totalPrice}
                appliedCoupon={coupon}
                onApply={(c, d) => {
                  setCoupon(c)
                  setDiscount(d)
                }}
                onRemove={() => {
                  setCoupon(null)
                  setDiscount(0)
                }}
              />
            </div>

            {discount > 0 && (
              <div className="flex justify-between mb-2 text-green-600">
                <span className="text-sm">Discount ({coupon?.code})</span>
                <span className="font-medium">-${discount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between mb-6">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-2xl text-purple-600">
                $${(totalPrice - discount).toFixed(2)}
              </span>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg border border-red-200 text-sm mb-4">
                {error}
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
            >
              {checkingOut ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <Link
              href="/products"
              className="block text-center text-sm text-gray-500 hover:text-purple-600 mt-4"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

