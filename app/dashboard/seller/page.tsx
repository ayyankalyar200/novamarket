"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import SellerAIAssistant from '@/components/SellerAIAssistant'
import {
  Loader2,
  CheckCircle,
  DollarSign,
  Package,
  TrendingUp,
  ExternalLink,
  ShoppingBag,
} from "lucide-react"

// ============================================
// INNER COMPONENT
// ============================================
function SellerDashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [stripeStatus, setStripeStatus] = useState<any>(null)
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, pending: 0 })
  const [message, setMessage] = useState("")

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }
      setUser(user)

      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()
      setProfile(prof)

      const res = await fetch("/api/stripe/status")
      const status = await res.json()
      setStripeStatus(status)

      const { count: productsCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("seller_id", user.id)

      const { data: orderItems } = await supabase
        .from("order_items")
        .select("quantity, price, orders(status)")
        .eq("seller_id", user.id)

      const revenue = orderItems?.reduce(
        (sum, i: any) => sum + i.quantity * i.price,
        0
      ) || 0

      const pending = orderItems?.filter(
        (i: any) => i.orders?.status === "paid"
      ).length || 0

      setStats({
        products: productsCount || 0,
        orders: orderItems?.length || 0,
        revenue: revenue,
        pending: pending,
      })

      setLoading(false)

      if (searchParams.get("stripe_success") === "true") {
        setMessage("✅ Stripe account connected successfully!")
      }
    }
    init()
  }, [router, searchParams])

  const handleConnectStripe = async () => {
    setConnecting(true)
    try {
      const res = await fetch("/api/stripe/connect", { method: "POST" })
      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || "Failed to connect Stripe")
        setConnecting(false)
      }
    } catch (err: any) {
      alert(err.message)
      setConnecting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Seller Dashboard</h1>
        <p className="text-gray-500">
          Welcome back, {profile?.username || user?.email}
        </p>
      </div>

      <div className="border-b mb-8">
        <nav className="flex gap-6 overflow-x-auto">
          <Link
            href="/dashboard/seller"
            className="pb-3 px-1 border-b-2 border-purple-600 text-purple-600 font-medium whitespace-nowrap"
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
            href="/dashboard/seller/coupons"
            className="pb-3 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 whitespace-nowrap"
          >
            🎟️ Coupons
          </Link>
          <Link
            href="/dashboard/seller/products"
            className="pb-3 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 whitespace-nowrap"
          >
            My Products
          </Link>
        </nav>
      </div>

      {message && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg border border-green-200 mb-6 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          {message}
        </div>
      )}

      {!stripeStatus?.onboarding_complete ? (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="bg-purple-600 text-white p-3 rounded-lg">
              <DollarSign className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-2 text-gray-900">
                {stripeStatus?.connected
                  ? "Complete your Stripe setup"
                  : "Start earning with Stripe"}
              </h2>
              <p className="text-gray-600 mb-4">
                {stripeStatus?.connected
                  ? "Your Stripe account is connected but onboarding is incomplete."
                  : "Connect your Stripe account to receive payments directly from buyers."}
              </p>
              <button
                onClick={handleConnectStripe}
                disabled={connecting}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium flex items-center gap-2"
              >
                {connecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    {stripeStatus?.connected ? "Continue Setup" : "Connect with Stripe"}
                    <ExternalLink className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <div>
            <p className="font-medium text-green-800">Stripe Connected ✅</p>
            <p className="text-sm text-green-700">
              Your account is ready to receive payments
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-gray-500">Products</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.products}</p>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingBag className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-gray-500">Orders</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.orders}</p>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-gray-500">Revenue</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            ${stats.revenue.toFixed(2)}
          </p>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <span className="text-sm text-gray-500">Pending</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/sell"
          className="bg-purple-600 text-white rounded-lg p-6 hover:bg-purple-700 transition"
        >
          <h3 className="text-xl font-bold mb-2">+ Add New Product</h3>
          <p className="opacity-90">List a new product for sale</p>
        </Link>

        <Link
          href="/dashboard/seller/orders"
          className="bg-white border rounded-lg p-6 hover:shadow-lg transition"
        >
          <h3 className="text-xl font-bold mb-2 text-gray-900">View Orders</h3>
          <p className="text-gray-500">Check your sales and ship products</p>
        </Link>
      </div>
    </div>
  )
}

// ============================================
// MAIN PAGE - wraps in Suspense
// ============================================
export default function SellerDashboard() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      }
    >
      <SellerDashboardContent />
    </Suspense>
  )
}



