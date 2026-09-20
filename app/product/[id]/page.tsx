import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Package, Shield, Truck, Heart, MessageSquare } from 'lucide-react'
import AddToCartButton from '@/components/AddToCartButton'
import StarRating from '@/components/reviews/StarRating'
import ReviewForm from '@/components/reviews/ReviewForm'
import ReviewList from '@/components/reviews/ReviewList'

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: product, error } = await supabase
    .from('products')
    .select('*, profiles(username, role), categories(name, slug, icon)')
    .eq('id', id)
    .single()

  if (error || !product) {
    notFound()
  }

  // Fetch reviews
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, profiles:buyer_id(username, full_name)')
    .eq('product_id', id)
    .order('created_at', { ascending: false })

  // Calculate average rating
  const avgRating = reviews && reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0

  // Related products
  const { data: relatedProducts } = await supabase
    .from('products')
    .select('*, profiles(username)')
    .eq('status', 'active')
    .eq('category_id', product.category_id)
    .neq('id', product.id)
    .limit(4)

  // Check user auth + purchase + existing review
  const { data: { user } } = await supabase.auth.getUser()
  let canReview = false
  let existingReview = null

  if (user) {
    // Check purchase
    const { data: purchased } = await supabase
      .from('order_items')
      .select('id, orders!inner(buyer_id, status)')
      .eq('product_id', id)
      .eq('orders.buyer_id', user.id)
      .in('orders.status', ['paid', 'shipped', 'delivered'])
      .limit(1)

    canReview = !!(purchased && purchased.length > 0)

    // Check existing review
    const { data: myReview } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', id)
      .eq('buyer_id', user.id)
      .single()

    existingReview = myReview
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-purple-600">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-purple-600">Products</Link>
        {product.categories && (
          <>
            <span className="mx-2">/</span>
            <Link
              href={`/products?category=${product.categories.slug}`}
              className="hover:text-purple-600"
            >
              {product.categories.name}
            </Link>
          </>
        )}
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Images */}
        <div>
          <div className="aspect-square bg-white rounded-lg border overflow-hidden mb-4">
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-6xl">
                📦
              </div>
            )}
          </div>

          {product.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img: string, i: number) => (
                <div key={i} className="aspect-square bg-white rounded border overflow-hidden">
                  <img src={img} alt={`${product.title} ${i}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          {product.categories && (
            <Link
              href={`/products?category=${product.categories.slug}`}
              className="inline-block text-sm text-purple-600 hover:underline mb-2"
            >
              {product.categories.icon} {product.categories.name}
            </Link>
          )}

          <h1 className="text-3xl font-bold mb-3 text-gray-900">{product.title}</h1>

          {/* Rating Summary */}
          <div className="flex items-center gap-3 mb-4">
            <StarRating rating={avgRating} size="md" />
            <span className="text-sm text-gray-600">
              {avgRating > 0 ? `${avgRating.toFixed(1)} / 5` : 'No reviews yet'}
              {reviews && reviews.length > 0 && (
                <span className="ml-2">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
              )}
            </span>
          </div>

          <div className="mb-6">
            <p className="text-4xl font-bold text-purple-600">
              ${product.price}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Condition: <span className="capitalize">{product.condition}</span>
            </p>
          </div>

          <div className="mb-6">
            {product.stock > 0 ? (
              <p className="text-green-600 font-medium">
                ✅ In Stock ({product.stock} available)
              </p>
            ) : (
              <p className="text-red-600 font-medium">❌ Out of Stock</p>
            )}
          </div>

          <AddToCartButton
            product={{
              id: product.id,
              title: product.title,
              price: product.price,
              images: product.images,
              seller_id: product.seller_id,
              stock: product.stock,
            }}
          />

          {/* Trust badges */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3 border mt-6">
            <div className="flex items-center gap-3 text-sm">
              <Truck className="w-5 h-5 text-purple-600" />
              <span>Fast worldwide shipping</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Shield className="w-5 h-5 text-purple-600" />
              <span>Buyer protection guaranteed</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Package className="w-5 h-5 text-purple-600" />
              <span>30-day return policy</span>
            </div>
          </div>

          <div className="mt-6 p-4 border rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Sold by</p>
            <p className="font-semibold">{product.profiles?.username || 'Unknown Seller'}</p>
            <p className="text-xs text-gray-500 mt-1">
              Role: {product.profiles?.role || 'seller'}
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className="bg-white rounded-lg border p-6 mb-12">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Description</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
        </div>
      )}

      {/* Reviews Section */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Reviews ({reviews?.length || 0})
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Review Form */}
          <div className="lg:col-span-1">
            {user ? (
              canReview ? (
                <ReviewForm
                  productId={product.id}
                  existingReview={existingReview}
                />
              ) : (
                <div className="bg-gray-50 rounded-lg border p-6 text-center">
                  <p className="text-gray-600 text-sm">
                    You can only review products you've purchased.
                  </p>
                </div>
              )
            ) : (
              <div className="bg-gray-50 rounded-lg border p-6 text-center">
                <p className="text-gray-600 text-sm mb-3">
                  Please login to write a review
                </p>
                <Link
                  href="/login"
                  className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm font-medium"
                >
                  Login
                </Link>
              </div>
            )}
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2">
            <ReviewList reviews={reviews || []} />
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((p: any) => (
              <Link
                key={p.id}
                href={`/product/${p.id}`}
                className="bg-white rounded-lg border overflow-hidden hover:shadow-lg transition"
              >
                <div className="aspect-square bg-gray-100">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">
                      📦
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm line-clamp-2 mb-1">{p.title}</h3>
                  <p className="text-purple-600 font-bold">${p.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
