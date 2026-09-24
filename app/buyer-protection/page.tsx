import { Shield, Lock, CheckCircle, AlertTriangle, CreditCard, MessageCircle } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Buyer Protection — NovaMarket',
  description: 'Shop safe with NovaMarket Buyer Protection',
}

export default function BuyerProtectionPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-10 text-white text-center mb-12">
        <Shield className="w-16 h-16 mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Buyer Protection
        </h1>
        <p className="text-xl opacity-90">
          Shop with 100% confidence on NovaMarket
        </p>
      </div>

      {/* Coverage */}
      <h2 className="text-2xl font-bold mb-6 dark:text-white text-center">
        What We Cover
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        {[
          { title: 'Item Never Arrived', desc: 'Full refund if your order doesn\'t reach you' },
          { title: 'Wrong Item Received', desc: 'Return it for the correct item or full refund' },
          { title: 'Item Not as Described', desc: 'Matches description or money back' },
          { title: 'Damaged in Transit', desc: 'Full refund or replacement' },
          { title: 'Counterfeit Products', desc: '100% refund if item is fake' },
          { title: 'Unauthorized Charges', desc: 'Zero liability for fraud' },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 p-5 flex gap-4"
          >
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold mb-1 dark:text-white">{item.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* How It Works */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border dark:border-slate-700 p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">How It Works</h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold mb-1 dark:text-white">1. Pay Securely</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All payments processed by Stripe with bank-level encryption.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-purple-100 dark:bg-purple-900/30 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold mb-1 dark:text-white">2. Protected Purchase</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your money is held in escrow until you receive the item.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-green-100 dark:bg-green-900/30 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold mb-1 dark:text-white">3. Report Issues</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                If anything goes wrong, report it within 30 days.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
              <Lock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-bold mb-1 dark:text-white">4. Get Refunded</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Full refund processed within 5-10 business days.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Not Covered */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-700 rounded-xl p-6 mb-8">
        <h3 className="font-bold text-lg mb-4 text-yellow-900 dark:text-yellow-300 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          What's Not Covered
        </h3>
        <ul className="space-y-2 text-sm text-yellow-800 dark:text-yellow-400">
          <li>• Items shipped after the return window (30 days)</li>
          <li>• Buyer damage or misuse</li>
          <li>• Disputes outside NovaMarket platform</li>
          <li>• Off-platform payments</li>
        </ul>
      </div>

      {/* CTA */}
      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Have a problem with an order?
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            href="/orders"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-medium"
          >
            View My Orders
          </Link>
          <Link
            href="/contact"
            className="bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:border-purple-600 font-medium"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}
