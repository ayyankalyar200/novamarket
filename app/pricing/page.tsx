import Link from 'next/link'
import { Check, X, Sparkles, Store, Crown, Building2 } from 'lucide-react'

export const metadata = {
  title: 'Pricing — NovaMarket',
  description: 'Free for sellers during our founding phase',
}

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    icon: Store,
    description: 'Perfect for getting started',
    color: 'green',
    badge: 'Current',
    features: [
      { text: 'Unlimited product listings', included: true },
      { text: 'Zero commission', included: true },
      { text: 'Basic analytics', included: true },
      { text: 'Buyer-seller chat', included: true },
      { text: 'Coupon creation', included: true },
      { text: 'Priority support', included: false },
      { text: 'AI listing assistant', included: false },
      { text: 'Advanced analytics', included: false },
    ],
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    icon: Crown,
    description: 'For growing sellers',
    color: 'purple',
    badge: 'Coming Soon',
    features: [
      { text: 'Everything in Free', included: true },
      { text: 'AI listing assistant', included: true },
      { text: 'Advanced analytics', included: true },
      { text: 'Bulk product upload', included: true },
      { text: 'Priority support', included: true },
      { text: 'Featured listings', included: true },
      { text: 'Custom store banner', included: true },
      { text: 'Priority placement', included: true },
    ],
  },
  {
    name: 'Business',
    price: '$99',
    period: '/month',
    icon: Building2,
    description: 'For large sellers',
    color: 'blue',
    badge: 'Coming Soon',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'API access', included: true },
      { text: 'Multi-user accounts', included: true },
      { text: 'Custom domain', included: true },
      { text: 'White-label option', included: true },
      { text: 'Dedicated manager', included: true },
      { text: 'Bulk inventory tools', included: true },
      { text: '24/7 support', included: true },
    ],
  },
]

export default function PricingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-full mb-4">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">Founding Phase — 100% FREE</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          During our founding phase, everything is FREE. No commission. No hidden fees.
        </p>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {PLANS.map((plan) => {
          const Icon = plan.icon
          const isActive = plan.badge === 'Current'

          return (
            <div
              key={plan.name}
              className={`bg-white dark:bg-slate-800 rounded-2xl border-2 p-6 relative ${
                isActive
                  ? 'border-green-500 shadow-lg'
                  : plan.name === 'Pro'
                  ? 'border-purple-500'
                  : 'border-gray-200 dark:border-slate-700'
              }`}
            >
              {/* Badge */}
              <div className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full ${
                isActive
                  ? 'bg-green-100 text-green-700'
                  : 'bg-purple-100 text-purple-700'
              }`}>
                {plan.badge}
              </div>

              <div className={`bg-${plan.color}-100 dark:bg-${plan.color}-900/30 w-14 h-14 rounded-xl flex items-center justify-center mb-4`}>
                <Icon className={`w-7 h-7 text-${plan.color}-600`} />
              </div>

              <h3 className="text-2xl font-bold mb-1 dark:text-white">{plan.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {plan.description}
              </p>

              <div className="mb-6">
                <span className="text-4xl font-bold dark:text-white">{plan.price}</span>
                <span className="text-gray-500 dark:text-gray-400"> {plan.period}</span>
              </div>

              <Link
                href={isActive ? '/sell' : '/contact'}
                className={`block w-full py-3 rounded-lg font-medium text-center transition ${
                  isActive
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                {isActive ? 'Start Selling Free' : 'Notify Me'}
              </Link>

              <ul className="space-y-3 mt-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    {feature.included ? (
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={feature.included ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      {/* FAQ */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border dark:border-slate-700 p-8">
        <h2 className="text-2xl font-bold mb-6 dark:text-white text-center">
          Pricing Questions
        </h2>
        <div className="space-y-4 max-w-3xl mx-auto">
          {[
            { q: 'Is the Free plan really free?', a: 'Yes! During our founding phase, everything is free with zero commission. No hidden fees.' },
            { q: 'When will paid plans launch?', a: 'Once we reach 500+ active sellers, we\'ll introduce Pro and Business plans. Current sellers keep free access for 6 months.' },
            { q: 'What is the commission?', a: 'Zero commission during the founding phase. Sellers keep 100% of their earnings.' },
            { q: 'Do buyers pay anything?', a: 'No, buyers never pay platform fees. Shopping is always free.' },
            { q: 'How do I get paid?', a: 'Payments go directly to your Stripe-connected bank account. Fast and secure.' },
          ].map((faq, i) => (
            <details
              key={i}
              className="bg-gray-50 dark:bg-slate-900/50 rounded-lg overflow-hidden"
            >
              <summary className="cursor-pointer p-4 font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-900">
                {faq.q}
              </summary>
              <p className="px-4 pb-4 text-gray-600 dark:text-gray-400 text-sm">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </div>
  )
}
