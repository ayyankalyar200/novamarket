import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ArrowLeft, Package, User, DollarSign, Calendar, Store } from "lucide-react"

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      *,
      profiles:buyer_id (username, full_name, avatar_url),
      order_items (
        id,
        quantity,
        price,
        product_id,
        seller_id,
        products (id, title, images),
        profiles:seller_id (username, store_name)
      )
    `)
    .eq("id", id)
    .single()

  if (error || !order) notFound()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-700 border-green-300"
      case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-300"
      case "shipped": return "bg-blue-100 text-blue-700 border-blue-300"
      case "delivered": return "bg-purple-100 text-purple-700 border-purple-300"
      case "cancelled": return "bg-red-100 text-red-700 border-red-300"
      default: return "bg-gray-100 text-gray-700 border-gray-300"
    }
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-600 text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to All Orders
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Order #{order.id.slice(0, 8).toUpperCase()}
          </h2>
          <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(order.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-medium border-2 ${getStatusColor(order.status)}`}>
          {order.status.toUpperCase()}
        </span>
      </div>

      {/* Buyer Info */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-1">
          <User className="w-4 h-4" />
          Buyer
        </h3>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-600">
            {(order.profiles?.username || "U")[0].toUpperCase()}
          </div>
          <div>
            <p className="font-medium">{order.profiles?.username || "Unknown"}</p>
            <p className="text-xs text-gray-500">{order.profiles?.full_name || ""}</p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="text-sm font-medium text-gray-500 mb-4 flex items-center gap-1">
          <Package className="w-4 h-4" />
          Items ({order.order_items?.length || 0})
        </h3>
        <div className="space-y-3">
          {order.order_items?.map((item: any) => (
            <div key={item.id} className="flex items-center gap-3 pb-3 border-b last:border-0 last:pb-0">
              <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {item.products?.title || "Unknown"}
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Store className="w-3 h-3" />
                  {item.profiles?.store_name || item.profiles?.username || "Unknown Seller"}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                <p className="text-xs text-gray-500">
                  {item.quantity} × ${item.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex justify-between items-center mb-3 pb-3 border-b">
          <span className="text-gray-500 flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            Total
          </span>
          <span className="text-2xl font-bold text-purple-600">
            ${order.total.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Platform Commission (5%)</span>
          <span className="font-medium text-green-600">
            ${(order.total * 0.05).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  )
}

