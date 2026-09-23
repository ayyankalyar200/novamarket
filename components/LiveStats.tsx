import { createClient } from '@/lib/supabase/server'
import { Package, Users, ShoppingBag, TrendingUp } from 'lucide-react'

export default async function LiveStats() {
  const supabase = await createClient()

  // Get real numbers from database
  const [
    { count: productsCount },
    { count: usersCount },
    { count: ordersCount },
    { count: sellersCount },
  ] = await Promise.all([
    supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .in('status', ['paid', 'shipped', 'delivered']),
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'seller'),
  ])

  // Check if we're in founding phase (under 1000 users)
  const totalUsers = usersCount || 0
  const isFoundingPhase = totalUsers < 1000

  const stats = [
    {
      label: 'Products',
      value: productsCount || 0,
      icon: Package,
      gradient: 'from-purple-500 to-purple-600',
      suffix: '+',
    },
    {
      label: 'Members',
      value: totalUsers,
      icon: Users,
      gradient: 'from-blue-500 to-blue-600',
      suffix: '+',
    },
    {
      label: 'Sellers',
      value: sellersCount || 0,
      icon: TrendingUp,
      gradient: 'from-green-500 to-green-600',
      suffix: '+',
    },
    {
      label: 'Orders',
      value: ordersCount || 0,
      icon: ShoppingBag,
      gradient: 'from-orange-500 to-orange-600',
      suffix: '',
    },
  ]

  return (
    <section className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Founding Phase Banner */}
        {isFoundingPhase && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-300 dark:border-yellow-700 px-5 py-2.5 rounded-full shadow-sm">
              <span className="text-2xl animate-pulse">🚀</span>
              <div className="text-left">
                <p className="font-bold text-sm text-yellow-900 dark:text-yellow-300">
                  Founding Phase
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-400">
                  Be among our first 1000 members!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="text-center group hover:scale-105 transition-transform"
              >
                <div
                  className={`bg-gradient-to-br ${stat.gradient} w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-xl transition`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <p className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                  {stat.value.toLocaleString()}
                  <span className="text-purple-600 dark:text-purple-400">{stat.suffix}</span>
                </p>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium uppercase tracking-wide">
                  {stat.label}
                </p>
              </div>
            )
          })}
        </div>

        {/* Trust Message */}
        <div className="mt-8 pt-6 border-t dark:border-slate-700 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            🔒 Secured by Stripe · ✅ Verified by Google reCAPTCHA · 🌍 Trusted Worldwide
          </p>
        </div>
      </div>
    </section>
  )
}
