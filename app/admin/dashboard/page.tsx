import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import {
  Users,
  Store,
  ShoppingBag,
  FileText,
  Flag,
  AlertCircle,
  TrendingUp,
  DollarSign,
  ArrowRight,
} from "lucide-react"

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Stats
  const [
    { count: totalUsers },
    { count: totalSellers },
    { count: totalProducts },
    { count: totalOrders },
    { count: pendingRequests },
    { count: pendingReports },
    { data: orders },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "seller"),
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("seller_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("reports").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("orders").select("total, status"),
  ])

  const totalRevenue = orders
    ?.filter((o: any) => o.status === "paid" || o.status === "shipped" || o.status === "delivered")
    .reduce((sum: number, o: any) => sum + o.total, 0) || 0

  const platformRevenue = totalRevenue * 0.05 // 5% commission

  const stats = [
    {
      label: "Total Users",
      value: totalUsers || 0,
      icon: Users,
      color: "bg-blue-500",
      href: "/admin/users",
    },
    {
      label: "Total Sellers",
      value: totalSellers || 0,
      icon: Store,
      color: "bg-purple-500",
      href: "/admin/users",
    },
    {
      label: "Total Products",
      value: totalProducts || 0,
      icon: ShoppingBag,
      color: "bg-green-500",
      href: "/products",
    },
    {
      label: "Total Orders",
      value: totalOrders || 0,
      icon: FileText,
      color: "bg-orange-500",
      href: "/admin/orders",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-white rounded-xl border p-6 hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`${stat.color} p-3 rounded-lg text-white`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </Link>
          )
        })}
      </div>

      {/* Revenue Card */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm opacity-90 mb-1">Platform Revenue (5% commission)</p>
            <p className="text-4xl font-bold">${platformRevenue.toFixed(2)}</p>
            <p className="text-sm opacity-75 mt-1">From ${totalRevenue.toFixed(2)} total sales</p>
          </div>
          <div className="bg-white/20 p-4 rounded-lg">
            <DollarSign className="w-12 h-12" />
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pending Requests */}
        <Link
          href="/admin/requests"
          className="bg-white rounded-xl border p-6 hover:shadow-lg transition"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-yellow-600" />
            </div>
            {pendingRequests && pendingRequests > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {pendingRequests} NEW
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold mb-1">Seller Requests</h3>
          <p className="text-gray-500 text-sm mb-4">
            Review pending seller applications
          </p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-yellow-600">
              {pendingRequests || 0} pending
            </span>
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </div>
        </Link>

        {/* Pending Reports */}
        <Link
          href="/admin/reports"
          className="bg-white rounded-xl border p-6 hover:shadow-lg transition"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="bg-red-100 p-3 rounded-lg">
              <Flag className="w-6 h-6 text-red-600" />
            </div>
            {pendingReports && pendingReports > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {pendingReports} NEW
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold mb-1">Reports</h3>
          <p className="text-gray-500 text-sm mb-4">
            Review reported users and products
          </p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-red-600">
              {pendingReports || 0} pending
            </span>
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </div>
        </Link>
      </div>
    </div>
  )
}

