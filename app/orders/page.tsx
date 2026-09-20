import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Package, ArrowRight } from "lucide-react"

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        id,
        quantity,
        price,
        products (id, title, images)
      )
    `)
    .eq("buyer_id", user.id)
    .order("created_at", { ascending: false })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-700"
      case "pending": return "bg-yellow-100 text-yellow-700"
      case "shipped": return "bg-blue-100 text-blue-700"
      case "delivered": return "bg-purple-100 text-purple-700"
      case "cancelled": return "bg-red-100 text-red-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">My Orders</h1>
        <p className="text-gray-500">
          {orders?.length || 0} order{orders?.length !== 1 ? "s" : ""}
        </p>
      </div>

      {orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block bg-white rounded-lg border p-4 hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-500">
                    Order #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status.toUpperCase()}
                  </span>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div className="flex gap-3 mb-3 flex-wrap">
                {order.order_items?.slice(0, 3).map((item: any) => (
                  <div key={item.id} className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden">
                    {item.products?.images?.[0] ? (
                      <img
                        src={item.products.images[0]}
                        alt={item.products.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        📦
                      </div>
                    )}
                  </div>
                ))}
                {order.order_items?.length > 3 && (
                  <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-500">
                    +{order.order_items.length - 3}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between border-t pt-3">
                <span className="text-sm text-gray-500">
                  {order.order_items?.length || 0} item{order.order_items?.length !== 1 ? "s" : ""}
                </span>
                <span className="font-bold text-lg text-purple-600">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-lg border-2 border-dashed">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
          <Link
            href="/products"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-medium"
          >
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  )
}
