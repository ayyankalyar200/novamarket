import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/data/site-config'
import {
  Search, User, ShoppingCart, Store, Package,
  CreditCard, MessageCircle, AlertCircle, Mail,
} from 'lucide-react'

export const metadata = {
  title: 'Help Center — NovaMarket',
  description: 'Find answers to common questions about NovaMarket',
}

const CATEGORIES = [
  {
    icon: User,
    title: 'Account & Login',
    color: 'purple',
    faqs: [
      { q: 'How do I create an account?', a: 'Click "Sign Up" on the homepage. Enter your email, username, and password. Verify your email to activate your account.' },
      { q: 'I forgot my password', a: 'Click "Forgot Password" on the login page. We\'ll send you a reset link via email.' },
      { q: 'How to become a seller?', a: 'Sign up as a seller directly from the homepage, or apply via your profile if you\'re already a buyer.' },
    ],
  },
  {
    icon: ShoppingCart,
    title: 'Buying & Orders',
    color: 'blue',
    faqs: [
      { q: 'How do I place an order?', a: 'Add items to your cart, go to checkout, enter shipping info, and pay securely via Stripe.' },
      { q: 'What payment methods are accepted?', a: 'We accept all major credit/debit cards through Stripe (Visa, Mastercard, Amex).' },
      { q: 'Can I cancel my order?', a: 'Yes, you can cancel within 24 hours. Contact the seller via chat or email us.' },
    ],
  },
  {
    icon: Store,
    title: 'Selling',
    color: 'green',
    faqs: [
      { q: 'Is it free to sell?', a: 'YES! During our founding phase, selling is 100% FREE with zero commission.' },
      { q: 'How do I get paid?', a: 'Connect your Stripe account from your seller dashboard. Payments are auto-transferred to your bank.' },
      { q: 'How many products can I list?', a: 'Unlimited products during the founding phase.' },
    ],
  },
  {
    icon: Package,
    title: 'Shipping',
    color: 'orange',
    faqs: [
      { q: 'How long does shipping take?', a: 'Typically 3-7 business days depending on your location.' },
      { q: 'Who pays for shipping?', a: 'Sellers set shipping costs. Many offer free shipping during the founding phase.' },
      { q: 'Can I track my order?', a: 'Yes, go to My Orders to view real-time tracking for shipped items.' },
    ],
  },
  {
    icon: CreditCard,
    title: 'Payments & Refunds',
    color: 'yellow',
    faqs: [
      { q: 'When will I get my refund?', a: 'Refunds are processed within 5-10 business days to your original payment method.' },
      { q: 'Is my payment secure?', a: 'Yes, all payments are processed by Stripe with 256-bit encryption.' },
      { q: 'Do you support cash on delivery?', a: 'Currently we only support card payments via Stripe.' },
    ],
  },
  {
    icon: AlertCircle,
    title: 'Problems & Reports',
    color: 'red',
    faqs: [
      { q: 'How do I report a problem?', a: 'Click the "Report" button on any product or seller page. Our team reviews within 24 hours.' },
      { q: 'Item never arrived', a: 'First contact the seller via chat. If not resolved, open a dispute — you\'re covered by Buyer Protection.' },
      { q: 'Received wrong item', a: 'Report via the order page. We\'ll help arrange a replacement or full refund.' },
    ],
  },
]

export default function HelpPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
          Help Center
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 mb-6">
          Find answers to your questions
        </p>
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search help articles..."
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon
          return (
            <div
              key={cat.title}
              className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`bg-${cat.color}-100 dark:bg-${cat.color}-900/30 w-10 h-10 rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 text-${cat.color}-600`} />
                </div>
                <h2 className="font-bold text-lg dark:text-white">{cat.title}</h2>
              </div>
              <div className="space-y-3">
                {cat.faqs.map((faq) => (
                  <details
                    key={faq.q}
                    className="bg-gray-50 dark:bg-slate-900/50 rounded-lg overflow-hidden group"
                  >
                    <summary className="cursor-pointer p-3 font-medium text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-900">
                      {faq.q}
                    </summary>
                    <p className="px-3 pb-3 text-sm text-gray-600 dark:text-gray-400">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Still need help */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center">
        <MessageCircle className="w-12 h-12 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Still need help?</h2>
        <p className="mb-6 opacity-90">Our support team is ready to assist you</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <a
            href={`mailto:${SITE_CONFIG.email}`}
            className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            Email Us
          </a>
          <a
            href={SITE_CONFIG.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition inline-flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
