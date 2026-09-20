import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import {
  RevenueChart,
  OrdersChart,
  CategoryChart,
  StatsCard,
} from "@/components/charts/AnalyticsCharts"

export default async function SellerAnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: products } = await supabase
    .from("products")
    .select("*, categories(name, icon)")
    .eq("seller_id", user.id)

  const { data: orderItems } = await supabase
    .from("order_items")
    .select(`
      quantity,
      price,
      product_id,
      orders (status, created_at)
    `)
    .eq("seller_id", user.id)

  // Stats
  const totalRevenue = orderItems?.reduce(
    (sum: number, i: any) => sum + i.price * i.quantity,
    0
  ) || 0

  const totalOrders = orderItems?.length || 0
  const totalProducts = products?.length || 0

  // Revenue Chart Data (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d
  })

  const revenueData = last7Days.map((date) => {
    const dayStr = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
    const dayStart = new Date(date)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(date)
    dayEnd.setHours(23, 59, 59, 999)

    const dayRevenue = orderItems?.filter((item: any) => {
      const orderDate = new Date(item.orders?.created_at)
      return orderDate >= dayStart && orderDate <= dayEnd
    }).reduce((sum: number, i: any) => sum + i.price * i.quantity, 0) || 0

    const dayOrders = orderItems?.filter((item: any) => {
      const orderDate = new Date(item.orders?.created_at)
      return orderDate >= dayStart && orderDate <= dayEnd
    }).length || 0

    return {
      date: dayStr,
      revenue: Math.round(dayRevenue * 100) / 100,
      orders: dayOrders,
    }
  })

  // Category Chart Data
  const categoryMap: Record<string, number> = {}
  products?.forEach((p: any) => {
    const catName = p.categories?.name || "Other"
    categoryMap[catName] = (categoryMap[catName] || 0) + 1
  })

  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value,
  }))

  // Top Products
  const productSales: Record<string, { title: string; sales: number; revenue: number }> = {}
  orderItems?.forEach((item: any) => {
    if (!productSales[item.product_id]) {
      const product = products?.find((p: any) => p.id === item.product_id)
      productSales[item.product_id] = {
        title: product?.title || "Unknown",
        sales: 0,
        revenue: 0,
      }
    }
    productSales[item.product_id].sales += item.quantity
    productSales[item.product_id].revenue += item.quantity * item.price
  })

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Seller Dashboard</h1>
        <p className="text-gray-500">Track your performance and grow your business</p>
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
            className="pb-3 px-1 border-b-2 border-purple-600 text-purple-600 font-medium whitespace-nowrap"
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
            className="pb-3 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 whitespace-nowrap"
          >
            My Products
          </Link>
        </nav>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          change={totalRevenue > 0 ? "+12.5%" : undefined}
          iconName="DollarSign"
          color="purple"
        />
        <StatsCard
          title="Total Orders"
          value={totalOrders}
          iconName="ShoppingBag"
          color="blue"
        />
        <StatsCard
          title="Products"
          value={totalProducts}
          iconName="Package"
          color="green"
        />
        <StatsCard
          title="Avg Order Value"
          value={`$${totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : "0.00"}`}
          iconName="TrendingUp"
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Revenue (Last 7 Days)</h2>
            <span className="text-sm text-gray-500">📈</span>
          </div>
          {revenueData.some((d: any) => d.revenue > 0) ? (
            <RevenueChart data={revenueData} />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              No revenue data yet
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Orders (Last 7 Days)</h2>
            <span className="text-sm text-gray-500">📊</span>
          </div>
          {revenueData.some((d: any) => d.orders > 0) ? (
            <OrdersChart data={revenueData} />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              No order data yet
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Products by Category</h2>
            <span className="text-sm text-gray-500">🥧</span>
          </div>
          {categoryData.length > 0 ? (
            <CategoryChart data={categoryData} />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              No products yet
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Top Selling Products</h2>
            <span className="text-sm text-gray-500">🏆</span>
          </div>
          {topProducts.length > 0 ? (
            <div className="space-y-3">
              {topProducts.map((product, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{product.title}</p>
                    <p className="text-xs text-gray-500">{product.sales} sold</p>
                  </div>
                  <p className="font-bold text-purple-600">
                    ${product.revenue.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              No sales yet
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
