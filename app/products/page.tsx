import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; seller?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  // Build query
  let query = supabase
    .from('products')
    .select('id, title, price, images, seller_id, stock, status, is_hidden, created_at, category_id')
    .eq('status', 'active')
    .eq('is_hidden', false)
    .order('created_at', { ascending: false })

  // Category filter
  if (params.category) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', params.category)
      .maybeSingle()
    if (cat) {
      query = query.eq('category_id', cat.id)
    }
  }

  // Search
  if (params.q) {
    query = query.ilike('title', `%${params.q}%`)
  }

  // Seller filter
  if (params.seller) {
    query = query.eq('seller_id', params.seller)
  }

  const { data: productsRaw, error } = await query

  if (error) {
    console.error('Products error:', error)
  }

  // Get sellers
  const sellerIds = [...new Set(productsRaw?.map((p: any) => p.seller_id).filter(Boolean) || [])]
  const { data: sellers } = sellerIds.length > 0
    ? await supabase.from('profiles').select('id, username').in('id', sellerIds)
    : { data: [] }

  const products = productsRaw?.map((p: any) => ({
    ...p,
    profiles: sellers?.find((s: any) => s.id === p.seller_id) || null,
  })) || []

  // Categories for sidebar
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('id')

  const currentCategory = categories?.find((c: any) => c.slug === params.category)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          {currentCategory ? `${currentCategory.icon} ${currentCategory.name}` : 'All Products'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {products.length} product{products.length !== 1 ? 's' : ''} found
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border dark:border-slate-700 sticky top-32">
            <h3 className="font-bold mb-4 dark:text-white">Categories</h3>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/products"
                  className={`block px-3 py-2 rounded transition ${
                    !params.category
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-medium'
                      : 'hover:bg-gray-100 dark:hover:bg-slate-700 dark:text-gray-300'
                  }`}
                >
                  All Products
                </Link>
              </li>
              {categories?.map((cat: any) => (
                <li key={cat.id}>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className={`block px-3 py-2 rounded transition ${
                      params.category === cat.slug
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-medium'
                        : 'hover:bg-gray-100 dark:hover:bg-slate-700 dark:text-gray-300'
                    }`}
                  >
                    {cat.icon} {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="lg:col-span-3">
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((p: any) => (
                <Link
                  key={p.id}
                  href={`/product/${p.id}`}
                  className="bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700 overflow-hidden hover:shadow-lg transition group"
                >
                  <div className="aspect-square bg-gray-100 dark:bg-slate-700 overflow-hidden">
                    {p.images?.[0] ? (
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">
                        📦
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm line-clamp-2 mb-1 min-h-[2.5rem] dark:text-white">
                      {p.title}
                    </h3>
                    <p className="text-purple-600 font-bold text-lg">${p.price}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      by {p.profiles?.username || 'Seller'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-lg border-2 border-dashed dark:border-slate-700">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                No products found
              </p>
              <Link
                href="/sell"
                className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
              >
                Be the first seller
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
