import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Package, Plus } from "lucide-react"

export default async function SellerProductsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Seller Dashboard</h1>
        <p className="text-gray-500">Manage your orders and products</p>
      </div>

      <div className="border-b mb-8">
        <nav className="flex gap-6 overflow-x-auto">
          <Link
            href="/dashboard/seller"
            className="pb-3 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 whitespace-nowrap"
          >
            Overview
          </Link>
          <Link
            href="/dashboard/seller/analytics"
            className="pb-3 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 whitespace-nowrap"
          >
            📊 Analytics
          </Link>
          <Link
            href="/dashboard/seller/orders"
            className="pb-3 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 whitespace-nowrap"
          >
            Orders
          </Link>
          <Link
            href="/dashboard/seller/products"
            className="pb-3 px-1 border-b-2 border-purple-600 text-purple-600 font-medium whitespace-nowrap"
          >
            My Products
          </Link>
        </nav>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Products</h2>
          <p className="text-gray-500 text-sm mt-1">
            {products?.length || 0} product{products?.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/sell"
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 font-medium flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product: any) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="bg-white rounded-lg border overflow-hidden hover:shadow-lg transition"
            >
              <div className="aspect-video bg-gray-100">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-5xl">
                    📦
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">
                  {product.title}
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-purple-600 font-bold">${product.price}</p>
                  <span className="text-xs text-gray-500">
                    Stock: {product.stock}
                  </span>
                </div>
                {/* Return Policy Badge */}
                <div className="mt-2 flex items-center gap-1 text-xs">
                  {product.return_days === 0 ? (
                    <span className="text-red-600 dark:text-red-400 font-medium">
                      🚫 No returns
                    </span>
                  ) : (
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      ↩️ {product.return_days}-day returns
                    </span>
                  )}
                </div>
                
                <div className="mt-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      product.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {product.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-lg border-2 border-dashed">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">No products yet</h2>
          <p className="text-gray-500 mb-6">Start selling by adding your first product</p>
          <Link
            href="/sell"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-medium"
          >
            Add Your First Product
          </Link>
        </div>
      )}
    </div>
  )
}


