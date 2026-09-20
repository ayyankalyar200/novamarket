import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Package, ArrowRight, DollarSign, Clock } from "lucide-react"

export default async function SellerOrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  // Fetch order items where this user is the seller
  const { data: orderItems, error } = await supabase
    .from("order_items")
    .select(`
      id,
      quantity,
      price,
      order_id,
      product_id,
      products (id, title, images),
      orders (
        id,
        buyer_id,
        total,
        status,
        payment_status,
        created_at,
        profiles:buyer_id (username, full_name)
      )
    `)
    .eq("seller_id", user.id)
    .order("id", { ascending: false })

  // Group by order
  const groupedOrders: Record<string, any> = {}
  orderItems?.forEach((item: any) => {
    const orderId = item.orders?.id
    if (!orderId) return
    if (!groupedOrders[orderId]) {
      groupedOrders[orderId] = {
        order: item.orders,
        items: [],
        subtotal: 0,
        itemCount: 0,
      }
    }
    groupedOrders[orderId].items.push(item)
    groupedOrders[orderId].subtotal += item.price * item.quantity
    groupedOrders[orderId].itemCount += item.quantity
  })

  const orders = Object.values(groupedOrders).sort(
    (a: any, b: any) => new Date(b.order.created_at).getTime() - new Date(a.order.created_at).getTime()
  )

  const totalRevenue = orders
    .filter((o: any) => o.order.status === "paid" || o.order.status === "shipped" || o.order.status === "delivered")
    .reduce((sum: number, o: any) => sum + o.subtotal, 0)

  const pendingOrders = orders.filter((o: any) => o.order.status === "paid").length

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
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header with Tabs */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Seller Dashboard</h1>
        <p className="text-gray-500">Manage your orders and products</p>
      </div>

      {/* Tabs */}
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
            className="pb-3 px-1 border-b-2 border-purple-600 text-purple-600 font-medium whitespace-nowrap"
          >
            Orders ({orders.length})
          </Link>
          <Link
            href="/dashboard/seller/products"
            className="pb-3 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 whitespace-nowrap"
          >
            My Products
          </Link>
        </nav>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-gray-500">Total Orders</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-gray-500">Total Revenue</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-gray-500">Pending Shipment</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{pendingOrders}</p>
        </div>
      </div>

      {/* Orders List */}
      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((item: any) => (
            <div key={item.order.id} className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
                <div>
                  <p className="text-sm text-gray-500">
                    Order #{item.order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(item.order.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.order.status)}`}>
                  {item.order.status.toUpperCase()}
                </span>
              </div>

              {/* Buyer Info */}
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <p className="text-xs text-gray-500 mb-1">Buyer</p>
                <p className="font-medium text-sm text-gray-900">
                  {item.order.profiles?.username || item.order.profiles?.full_name || "Unknown"}
                </p>
              </div>

              {/* Items */}
              <div className="space-y-2 mb-3">
                {item.items.map((orderItem: any) => (
                  <div key={orderItem.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      {orderItem.products?.images?.[0] ? (
                        <img
                          src={orderItem.products.images[0]}
                          alt={orderItem.products.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          📦
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {orderItem.products?.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {orderItem.quantity} × ${orderItem.price}
                      </p>
                    </div>
                    <p className="font-bold text-sm">
                      ${(orderItem.price * orderItem.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t pt-3">
                <span className="text-sm text-gray-500">
                  {item.itemCount} item{item.itemCount !== 1 ? "s" : ""} • Your earnings:{" "}
                  <span className="font-bold text-purple-600">
                    ${(item.subtotal * 0.95).toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-400 ml-2">(after 5% commission)</span>
                </span>
                <Link
                  href={`/orders/${item.order.id}`}
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1"
                >
                  View Details
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-lg border-2 border-dashed">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">When someone buys your products, orders will appear here</p>
          <Link
            href="/sell"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-medium"
          >
            Add More Products
          </Link>
        </div>
      )}
    </div>
  )
}

