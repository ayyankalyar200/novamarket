import { SITE_CONFIG } from '@/lib/data/site-config'
import { Sparkles, Shield, Zap, Users, Globe, Heart } from 'lucide-react'

export const metadata = {
  title: 'About Us — NovaMarket',
  description: 'Learn about NovaMarket — Pakistan\'s AI-powered marketplace',
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
          About <span className="text-purple-600">NovaMarket</span>
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Pakistan's smarter marketplace — connecting buyers and sellers with AI-powered technology
        </p>
      </div>

      {/* Story */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border dark:border-slate-700 p-8 mb-8">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Our Story</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          NovaMarket was founded in {SITE_CONFIG.founded} by {SITE_CONFIG.founder} with a simple
          mission: make online buying and selling easier, safer, and smarter for everyone in
          {' '}{SITE_CONFIG.country} and beyond.
        </p>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          We noticed that existing marketplaces were either too expensive for sellers (with
          high commission fees) or too complex for buyers. So we built something different:
          a marketplace powered by AI, with zero commission for sellers during our founding
          phase, and a smarter shopping experience for buyers.
        </p>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Today, NovaMarket is growing fast — and we're just getting started.
        </p>
      </div>

      {/* Values */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 dark:text-white text-center">What We Stand For</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 p-6">
            <div className="bg-purple-100 dark:bg-purple-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold mb-2 dark:text-white">Trust First</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Every seller is verified. Every payment is secure. Buyer protection on every order.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 p-6">
            <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold mb-2 dark:text-white">AI-Powered</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Smart search, AI assistant, and intelligent recommendations — all in one place.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 p-6">
            <div className="bg-green-100 dark:bg-green-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
              <Heart className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold mb-2 dark:text-white">Seller Friendly</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              FREE during founding phase. Zero commission. Fast payouts via Stripe.
            </p>
          </div>
        </div>
      </div>

      {/* Founder Message */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
        <p className="text-sm uppercase tracking-wider opacity-90 mb-3">A Message from Our Founder</p>
        <p className="text-lg leading-relaxed mb-4">
          "I built NovaMarket because I believe Pakistan deserves a world-class marketplace.
          One where sellers keep their earnings, buyers get real protection, and AI makes
          everything simpler. We're just getting started — thank you for being part of our journey."
        </p>
        <p className="font-bold">— {SITE_CONFIG.founder}</p>
        <p className="text-sm opacity-80">Founder, {SITE_CONFIG.name}</p>
      </div>
    </div>
  )
}
