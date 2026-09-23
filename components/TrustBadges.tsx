import { Shield, Lock, Award, Zap } from 'lucide-react'

export default function TrustBadges() {
  const badges = [
    {
      icon: Lock,
      title: 'SSL Secured',
      description: '256-bit encryption',
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      icon: Shield,
      title: 'Buyer Protection',
      description: '100% money back',
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      icon: Award,
      title: 'Verified Sellers',
      description: 'KYC checked',
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-100 dark:bg-purple-900/30',
    },
    {
      icon: Zap,
      title: 'Fast Delivery',
      description: 'Worldwide shipping',
      color: 'text-orange-600 dark:text-orange-400',
      bg: 'bg-orange-100 dark:bg-orange-900/30',
    },
  ]

  return (
    <section className="bg-gray-50 dark:bg-slate-900 border-b dark:border-slate-700 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge) => {
            const Icon = badge.icon
            return (
              <div
                key={badge.title}
                className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-xl p-4 border dark:border-slate-700 hover:shadow-md transition"
              >
                <div className={`${badge.bg} p-2.5 rounded-lg flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${badge.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-gray-900 dark:text-white truncate">
                    {badge.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {badge.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

