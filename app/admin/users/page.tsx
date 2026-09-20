import { createClient } from "@/lib/supabase/server"
import { Users, Shield, Store, User as UserIcon, Ban } from "lucide-react"
import UserActions from "@/components/admin/UserActions"

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const { data: { user: currentAdmin } } = await supabase.auth.getUser()

  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })

  // Stats
  const totalUsers = users?.length || 0
  const totalSellers = users?.filter((u: any) => u.role === "seller").length || 0
  const totalAdmins = users?.filter((u: any) => u.role === "admin").length || 0
  const totalBanned = users?.filter((u: any) => u.is_banned).length || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Users Management</h2>
        <p className="text-gray-500 text-sm mt-1">
          Manage roles, permissions, and bans for all users
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-gray-500">Total Users</span>
          </div>
          <p className="text-2xl font-bold">{totalUsers}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-1">
            <Store className="w-4 h-4 text-purple-600" />
            <span className="text-xs text-gray-500">Sellers</span>
          </div>
          <p className="text-2xl font-bold">{totalSellers}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-red-600" />
            <span className="text-xs text-gray-500">Admins</span>
          </div>
          <p className="text-2xl font-bold">{totalAdmins}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-1">
            <Ban className="w-4 h-4 text-red-600" />
            <span className="text-xs text-gray-500">Banned</span>
          </div>
          <p className="text-2xl font-bold">{totalBanned}</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                  User
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                  Role
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                  Joined
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users?.map((u: any) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                        u.role === "admin"
                          ? "bg-red-600"
                          : u.role === "seller"
                          ? "bg-blue-600"
                          : "bg-purple-600"
                      }`}>
                        {(u.username || "U")[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {u.username || "Unknown"}
                        </p>
                        {u.full_name && (
                          <p className="text-xs text-gray-500">{u.full_name}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                        u.role === "admin"
                          ? "bg-red-100 text-red-700"
                          : u.role === "seller"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {u.role === "admin" && <Shield className="w-3 h-3" />}
                      {u.role === "seller" && <Store className="w-3 h-3" />}
                      {u.role === "buyer" && <UserIcon className="w-3 h-3" />}
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {u.is_banned ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 px-2.5 py-1 rounded-full">
                        <Ban className="w-3 h-3" />
                        Banned
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                        Active
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {new Date(u.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <UserActions
                      user={{
                        id: u.id,
                        username: u.username,
                        role: u.role,
                        is_banned: u.is_banned,
                      }}
                      currentAdminId={currentAdmin?.id || ""}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
