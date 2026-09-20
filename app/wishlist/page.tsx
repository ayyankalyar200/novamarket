import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Heart, ArrowRight } from 'lucide-react'

export default async function WishlistPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: wishlistItems } = await supabase
    .from('wishlists')
    .select(`
      id,
      created_at,
      products (
        id,
        title,
        price,
        images,
        stock,
        status,
        profiles (username)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Filter active products
  const items = wishlistItems?.filter(
    (item: any) => item.products?.status === 'active'
  ) || []

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 flex items-center gap-3">
          <Heart className="w-8 h-8 text-red-500 fill-current" />
          My Wishlist
        </h1>
        <p className="text-gray-500">
          {items.length} item{items.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item: any) => (
            <Link
              key={item.id}
              href={`/product/${item.products.id}`}
              className="bg-white rounded-lg border overflow-hidden hover:shadow-lg transition group"
            >
              <div className="aspect-square bg-gray-100 overflow-hidden">
                {item.products.images?.[0] ? (
                  <img
                    src={item.products.images[0]}
                    alt={item.products.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">
                    📦
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-medium text-sm line-clamp-2 mb-1 min-h-[2.5rem]">
                  {item.products.title}
                </h3>
                <p className="text-purple-600 font-bold text-lg">
                  ${item.products.price}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  by {item.products.profiles?.username || 'Seller'}
                </p>
                {item.products.stock > 0 ? (
                  <p className="text-xs text-green-600 mt-1 font-medium">
                    ✅ In Stock
                  </p>
                ) : (
                  <p className="text-xs text-red-600 mt-1 font-medium">
                    ❌ Out of Stock
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-lg border-2 border-dashed">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">
            Save products you love to view them later
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-medium"
          >
            Browse Products
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      )}
    </div>
  )
}
