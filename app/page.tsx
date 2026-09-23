import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { TrendingUp, Zap, Shield, Truck, Store } from 'lucide-react'
import LiveStats from '@/components/LiveStats'
import TrustBadges from '@/components/TrustBadges'

export default async function Home() {
  const supabase = await createClient()

  // User info
  const { data: { user } } = await supabase.auth.getUser()
  let userRole = 'guest'
  
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()
    userRole = profile?.role || 'buyer'
  }

  const canSell = userRole === 'seller' || userRole === 'admin'

  // Categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('id')

  // Products (only IDs and basic fields)
  const { data: productsRaw, error: productsError } = await supabase
    .from('products')
    .select('id, title, price, images, seller_id, stock, status, is_hidden')
    .eq('status', 'active')
    .eq('is_hidden', false)
    .order('created_at', { ascending: false })
    .limit(8)

  if (productsError) {
    console.error('Products fetch error:', productsError)
  }

  // Get sellers separately
  const sellerIds = [...new Set(productsRaw?.map((p: any) => p.seller_id).filter(Boolean) || [])]
  const { data: sellers } = sellerIds.length > 0
    ? await supabase.from('profiles').select('id, username').in('id', sellerIds)
    : { data: [] }

  // Merge
  const products = productsRaw?.map((p: any) => ({
    ...p,
    profiles: sellers?.find((s: any) => s.id === p.seller_id) || null,
  })) || []

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Buy & Sell Anything on <span className="text-yellow-300">NovaMarket</span>
            </h1>
            <p className="text-xl mb-8 opacity-90">
              The smarter marketplace with AI-powered search, secure payments, and instant delivery.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link
                href="/products"
                className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Start Shopping
              </Link>
              
              {(userRole === 'guest' || canSell) && (
                <Link
                  href={canSell ? '/sell' : '/seller-signup'}
                  className="bg-purple-800 bg-opacity-50 border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-800 transition"
                >
                  Start Selling
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <LiveStats />
      <TrustBadges />
      

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold dark:text-white">Shop by Category</h2>
          <Link href="/products" className="text-purple-600 hover:underline text-sm font-medium">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {categories?.map((cat: any) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm hover:shadow-lg transition text-center border border-gray-100 dark:border-slate-700"
            >
              <div className="text-4xl mb-2">{cat.icon}</div>
              <p className="font-medium text-sm dark:text-white">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold dark:text-white">Featured Products</h2>
          <Link href="/products" className="text-purple-600 hover:underline text-sm font-medium">
            View all →
          </Link>
        </div>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.map((p: any) => (
              <Link
                key={p.id}
                href={`/product/${p.id}`}
                className="bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-lg transition overflow-hidden border border-gray-100 dark:border-slate-700 group"
              >
                <div className="aspect-square bg-gray-100 dark:bg-slate-700 overflow-hidden">
                  {p.images?.[0] ? (
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm line-clamp-2 mb-2 min-h-[2.5rem] dark:text-white">
                    {p.title}
                  </h3>
                  <p className="text-purple-600 font-bold text-lg">
                    ${p.price}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    by {p.profiles?.username || 'Seller'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-lg border-2 border-dashed border-gray-200 dark:border-slate-700">
            <div className="text-6xl mb-4">🛍️</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              No products yet. Be the first seller!
            </p>
            {userRole === 'guest' ? (
              <Link
                href="/seller-signup"
                className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
              >
                Start Selling
              </Link>
            ) : canSell ? (
              <Link
                href="/sell"
                className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
              >
                Start Selling
              </Link>
            ) : null}
          </div>
        )}
      </section>

      {/* CTA Section */}
      {(userRole === 'guest' || canSell) && (
        <section className="bg-purple-600 text-white py-16 mt-8">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Store className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to start selling?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of sellers on NovaMarket and reach millions of buyers worldwide.
            </p>
            <Link
              href={canSell ? '/sell' : '/seller-signup'}
              className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Become a Seller
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}



