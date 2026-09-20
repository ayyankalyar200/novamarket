import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Shield, LayoutDashboard, FileText, Users, Flag, Home } from "lucide-react"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") redirect("/")

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 rounded-2xl p-6 text-white mb-8">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Admin Panel</h1>
              <p className="text-sm opacity-90">NovaMarket Management Console</p>
            </div>
          </div>
        </div>

        {/* Admin Navigation */}
        <div className="bg-white rounded-lg border mb-8 overflow-hidden">
          <nav className="flex overflow-x-auto">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2 px-6 py-4 border-b-2 border-transparent hover:border-red-600 hover:text-red-600 whitespace-nowrap"
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>
            <Link
              href="/admin/requests"
              className="flex items-center gap-2 px-6 py-4 border-b-2 border-transparent hover:border-red-600 hover:text-red-600 whitespace-nowrap"
            >
              <FileText className="w-5 h-5" />
              Seller Requests
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center gap-2 px-6 py-4 border-b-2 border-transparent hover:border-red-600 hover:text-red-600 whitespace-nowrap"
            >
              <Users className="w-5 h-5" />
              Users
            </Link>
            <Link
              href="/admin/reports"
              className="flex items-center gap-2 px-6 py-4 border-b-2 border-transparent hover:border-red-600 hover:text-red-600 whitespace-nowrap"
            >
              <Flag className="w-5 h-5" />
              Reports
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 px-6 py-4 border-b-2 border-transparent hover:border-red-600 hover:text-red-600 whitespace-nowrap ml-auto"
            >
              <Home className="w-5 h-5" />
              Back to Site
            </Link>
          </nav>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  )
}
