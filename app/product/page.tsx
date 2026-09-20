import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('products')
    .select('*, profiles(username), categories(name, slug, icon)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (params.category) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', params.category)
      .single()
    if (cat) query = query.eq('category_id', cat.id)
  }

  if (params.q) {
    query = query.ilike('title', `%${params.q}%`)
  }

  const { data: products } = await query
  const { data: categories } = await supabase.from('categories').select('*').order('id')

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {params.category
            ? categories?.find((c: any) => c.slug === params.category)?.name || 'Products'
            : 'All Products'}
        </h1>
        <p className="text-gray-500">{products?.length || 0} products found</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-bold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products"
                  className={`block px-3 py-2 rounded ${
                    !params.category ? 'bg-purple-100 text-purple-700 font-medium' : 'hover:bg-gray-100'
                  }`}
                >
                  All Products
                </Link>
              </li>
              {categories?.map((cat: any) => (
                <li key={cat.id}>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className={`block px-3 py-2 rounded ${
                      params.category === cat.slug
                        ? 'bg-purple-100 text-purple-700 font-medium'
                        : 'hover:bg-gray-100'
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
          {products && products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((p: any) => (
                <Link
                  key={p.id}
                  href={`/product/${p.id}`}
                  className="bg-white rounded-lg shadow-sm hover:shadow-lg transition overflow-hidden border"
                >
                  <div className="aspect-square bg-gray-100">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
                        📦
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm line-clamp-2 mb-1 min-h-[2.5rem]">
                      {p.title}
                    </h3>
                    <p className="text-purple-600 font-bold text-lg">${p.price}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      by {p.profiles?.username || 'Seller'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-500 text-lg mb-4">No products yet</p>
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