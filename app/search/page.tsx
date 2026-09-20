import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Search, Package } from 'lucide-react'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const params = await searchParams
  const query = params.q?.trim() || ''
  const supabase = await createClient()

  let products: any[] = []

  if (query) {
    const { data } = await supabase
      .from('products')
      .select('*, profiles(username), categories(name, slug, icon)')
      .eq('status', 'active')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .limit(48)
    products = data || []
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">
          {query ? `Search results for "${query}"` : 'Search Products'}
        </h1>
        <p className="text-gray-500">
          {query
            ? `${products.length} product${products.length !== 1 ? 's' : ''} found`
            : 'Type in the search bar to find products'}
        </p>
      </div>

      {/* Results */}
      {!query ? (
        <div className="text-center py-20 bg-white rounded-lg border-2 border-dashed">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">Start Searching</h2>
          <p className="text-gray-500 mb-6">Use the search bar above to find products</p>
          <Link
            href="/products"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-medium"
          >
            Browse All Products
          </Link>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product: any) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="bg-white rounded-lg border overflow-hidden hover:shadow-lg transition group"
            >
              <div className="aspect-square bg-gray-100 overflow-hidden">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.title}
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
                  {product.title}
                </h3>
                <p className="text-purple-600 font-bold text-lg">
                  ${product.price}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  by {product.profiles?.username || 'Seller'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-lg border-2 border-dashed">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">No products found</h2>
          <p className="text-gray-500 mb-6">
            We couldn't find anything matching "{query}"
          </p>
          <Link
            href="/products"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-medium"
          >
            Browse All Products
          </Link>
        </div>
      )}
    </div>
  )
}
