import Link from "next/link"
import { XCircle, ShoppingCart } from "lucide-react"

export default function CheckoutCancelPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="bg-red-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
        <XCircle className="w-14 h-14 text-red-600" />
      </div>

      <h1 className="text-4xl font-bold mb-3 text-gray-900">
        Payment Cancelled
      </h1>
      <p className="text-gray-500 mb-8 text-lg">
        Your payment was not completed. Your cart is still saved.
      </p>

      <div className="flex gap-3 justify-center flex-wrap">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-medium"
        >
          <ShoppingCart className="w-5 h-5" />
          Return to Cart
        </Link>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:border-purple-600 font-medium"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}
