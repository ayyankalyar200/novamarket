import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { 
  Package, 
  ArrowRight, 
  Search, 
  Filter,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
} from "lucide-react"

export default async function AdminOrdersPage() {
  const supabase = await createClient()

  // Admin ko saari orders dikhengi
  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      profiles:buyer_id (username, full_name),
      order_items (
        id,
        quantity,
        price,
        seller_id,
        products (id, title, images),
        profiles:seller_id (username)
      )
    `)
    .order("created_at", { ascending: false })

  // Stats
  const totalOrders = orders?.length || 0
  const paidOrders = orders?.filter((o: any) => o.status === "paid").length || 0
  const pendingOrders = orders?.filter((o: any) => o.status === "pending").length || 0
  const totalRevenue = orders
    ?.filter((o: any) => ["paid", "shipped", "delivered"].includes(o.status))
    .reduce((sum: number, o: any) => sum + o.total, 0) || 0

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">All Orders</h2>
          <p className="text-gray-500 text-sm mt-1">
            Manage all platform orders ({totalOrders} total)
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-gray-500">Total Orders</span>
          </div>
          <p className="text-2xl font-bold">{totalOrders}</p>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-xs text-gray-500">Paid</span>
          </div>
          <p className="text-2xl font-bold">{paidOrders}</p>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-yellow-600" />
            <span className="text-xs text-gray-500">Pending</span>
          </div>
          <p className="text-2xl font-bold">{pendingOrders}</p>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs opacity-90">Platform Revenue</span>
          </div>
          <p className="text-2xl font-bold">${(totalRevenue * 0.05).toFixed(2)}</p>
          <p className="text-xs opacity-75 mt-1">from ${totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Orders List */}
      {orders && orders.length > 0 ? (
        <div className="space-y-3">
          {orders.map((order: any) => (
            <Link
              key={order.id}
              href={`/admin/orders/${order.id}`}
              className="block bg-white rounded-lg border p-4 hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    order.status === "paid" ? "bg-green-100 text-green-700" :
                    order.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {(order.profiles?.username || "U")[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-500">
                      by {order.profiles?.username || "Unknown"} · {" "}
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status.toUpperCase()}
                  </span>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Items */}
              <div className="flex gap-2 mb-3 flex-wrap">
                {order.order_items?.slice(0, 5).map((item: any) => (
                  <div key={item.id} className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
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
                {order.order_items?.length > 5 && (
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-500">
                    +{order.order_items.length - 5}
                  </div>
                )}
              </div>

              {/* Footer */}
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
          <h3 className="text-xl font-bold text-gray-700 mb-2">No orders yet</h3>
          <p className="text-gray-500">Orders will appear here when buyers purchase products</p>
        </div>
      )}
    </div>
  )
}
