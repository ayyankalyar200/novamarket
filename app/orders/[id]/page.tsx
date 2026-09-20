import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { Package, Truck, CheckCircle, Clock, ArrowLeft, XCircle } from "lucide-react"

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        id,
        quantity,
        price,
        products (id, title, images, description),
        profiles:seller_id (username)
      )
    `)
    .eq("id", id)
    .eq("buyer_id", user.id)
    .single()

  if (error || !order) notFound()

  const statusSteps = ["pending", "paid", "shipped", "delivered"]
  const currentStep = statusSteps.indexOf(order.status)

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
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link
        href="/orders"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-600 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Orders
      </Link>

      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1 text-gray-900">
            Order #{order.id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-gray-500">
            Placed on {new Date(order.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-medium border-2 ${getStatusColor(order.status)}`}>
          {order.status.toUpperCase()}
        </span>
      </div>

      {order.status !== "cancelled" && (
        <div className="bg-white rounded-lg border p-6 mb-8">
          <div className="flex items-center justify-between">
            {[
              { key: "pending", label: "Order Placed", icon: Clock },
              { key: "paid", label: "Paid", icon: CheckCircle },
              { key: "shipped", label: "Shipped", icon: Truck },
              { key: "delivered", label: "Delivered", icon: Package },
            ].map((step, idx) => {
              const Icon = step.icon
              const isActive = idx <= currentStep
              return (
                <div key={step.key} className="flex-1 flex flex-col items-center relative">
                  {idx < 3 && (
                    <div
                      className={`absolute top-5 left-1/2 w-full h-0.5 ${
                        idx < currentStep ? "bg-purple-600" : "bg-gray-200"
                      }`}
                    />
                  )}
                  <div
                    className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center ${
                      isActive ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs mt-2 text-center ${isActive ? "text-purple-600 font-medium" : "text-gray-400"}`}>
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {order.status === "cancelled" && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 flex items-center gap-3">
          <XCircle className="w-6 h-6 text-red-600" />
          <div>
            <p className="font-medium text-red-800">Order Cancelled</p>
            <p className="text-sm text-red-700">This order was cancelled</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Items</h2>
        <div className="space-y-4">
          {order.order_items?.map((item: any) => (
            <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
              <Link
                href={`/product/${item.products?.id}`}
                className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0"
              >
                {item.products?.images?.[0] ? (
                  <img
                    src={item.products.images[0]}
                    alt={item.products.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl">
                    📦
                  </div>
                )}
              </Link>
              <div className="flex-1">
                <Link
                  href={`/product/${item.products?.id}`}
                  className="font-medium text-gray-900 hover:text-purple-600"
                >
                  {item.products?.title}
                </Link>
                <p className="text-sm text-gray-500 mt-1">
                  Sold by {item.profiles?.username || "Seller"}
                </p>
                <p className="text-sm text-gray-500 mt-1">Quantity: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                <p className="text-xs text-gray-500">${item.price} each</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Order Summary</h2>
        <div className="space-y-2 mb-4 pb-4 border-b">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            <span className="text-green-600">Free</span>
          </div>
        </div>
        <div className="flex justify-between">
          <span className="font-bold text-lg">Total</span>
          <span className="font-bold text-2xl text-purple-600">
            ${order.total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  )
}
