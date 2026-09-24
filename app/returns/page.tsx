import { RotateCcw, Clock, CheckCircle, XCircle, Package, CreditCard, Info } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Returns & Refunds — NovaMarket',
  description: 'Learn about our returns and refunds policy',
}

export default function ReturnsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="bg-purple-100 dark:bg-purple-900/30 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <RotateCcw className="w-10 h-10 text-purple-600" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          Returns & Refunds
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          Shop with confidence — easy returns, guaranteed refunds
        </p>
      </div>

      {/* Key Points */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 p-6 text-center">
          <Clock className="w-8 h-8 text-purple-600 mx-auto mb-3" />
          <p className="text-2xl font-bold dark:text-white">Seller-Set</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Return window</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 p-6 text-center">
          <CreditCard className="w-8 h-8 text-purple-600 mx-auto mb-3" />
          <p className="text-2xl font-bold dark:text-white">100%</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Money back</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 p-6 text-center">
          <Package className="w-8 h-8 text-purple-600 mx-auto mb-3" />
          <p className="text-2xl font-bold dark:text-white">Free</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Return shipping*</p>
        </div>
      </div>

      {/* Return Process */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border dark:border-slate-700 p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">How to Return an Item</h2>
        <div className="space-y-6">
          {[
            { step: 1, title: 'Contact the Seller', desc: 'Reach out via chat within 30 days of delivery. Explain the issue.' },
            { step: 2, title: 'Get Approval', desc: 'Seller or our support team approves your return request.' },
            { step: 3, title: 'Ship the Item', desc: 'Pack the item safely and ship it back using the label we provide.' },
            { step: 4, title: 'Get Your Refund', desc: 'Once received, we process your refund within 5-10 business days.' },
          ].map((s) => (
            <div key={s.step} className="flex gap-4">
              <div className="bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                {s.step}
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1 dark:text-white">{s.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Eligible / Not Eligible */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700 rounded-xl p-6">
          <h3 className="font-bold text-lg mb-4 text-green-800 dark:text-green-300 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Eligible for Return
          </h3>
          <ul className="space-y-2 text-sm text-green-700 dark:text-green-400">
            <li>✅ Item arrived damaged</li>
            <li>✅ Item not as described</li>
            <li>✅ Wrong item received</li>
            <li>✅ Item never arrived</li>
            <li>✅ Item stopped working within warranty</li>
          </ul>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-700 rounded-xl p-6">
          <h3 className="font-bold text-lg mb-4 text-red-800 dark:text-red-300 flex items-center gap-2">
            <XCircle className="w-5 h-5" />
            Not Eligible
          </h3>
          <ul className="space-y-2 text-sm text-red-700 dark:text-red-400">
            <li>❌ Change of mind after 30 days</li>
            <li>❌ Item damaged by buyer</li>
            <li>❌ Used/worn items</li>
            <li>❌ Intimate/personal items</li>
            <li>❌ Digital downloads</li>
          </ul>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-gray-100 dark:bg-slate-800 rounded-xl p-6 text-center">
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Need help with a return? Our team is here for you.
        </p>
        <Link
          href="/contact"
          className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-medium"
        >
          Contact Support
        </Link>
      </div>
    </div>
  )
}

