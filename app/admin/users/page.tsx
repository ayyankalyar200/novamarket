import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Users, Shield, Store, User as UserIcon, Ban, Eye } from "lucide-react"
import UserActions from "@/components/admin/UserActions"
import UserStatus from '@/components/UserStatus'

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const { data: { user: currentAdmin } } = await supabase.auth.getUser()

  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })

  const totalUsers = users?.length || 0
  const totalSellers = users?.filter((u: any) => u.role === "seller").length || 0
  const totalAdmins = users?.filter((u: any) => u.role === "admin").length || 0
  const totalBanned = users?.filter((u: any) => u.is_banned).length || 0

  const timeAgo = (date: string | null) => {
    if (!date) return "Never"
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (mins < 1) return "Just now"
    if (mins < 60) return `${mins}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return new Date(date).toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Users Management
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Manage roles, permissions, activity, and bans for all users
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Total Users</span>
          </div>
          <p className="text-2xl font-bold dark:text-white">{totalUsers}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Store className="w-4 h-4 text-purple-600" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Sellers</span>
          </div>
          <p className="text-2xl font-bold dark:text-white">{totalSellers}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-red-600" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Admins</span>
          </div>
          <p className="text-2xl font-bold dark:text-white">{totalAdmins}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Ban className="w-4 h-4 text-red-600" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Banned</span>
          </div>
          <p className="text-2xl font-bold dark:text-white">{totalBanned}</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-900 border-b dark:border-slate-700">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  User
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Role
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Last Login
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-700">
              {users?.map((u: any) => (
                <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                  <td className="py-3 px-4">
                    <Link
                      href={`/admin/users/${u.id}`}
                      className="flex items-center gap-3 group"
                    >
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
                        <p className="font-medium text-sm group-hover:text-purple-600 dark:group-hover:text-purple-400 dark:text-white">
                          {u.username || "Unknown"}
                        </p>
                        {u.full_name && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {u.full_name}
                          </p>
                        )}
                      </div>
                    </Link>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                        u.role === "admin"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : u.role === "seller"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                      }`}
                    >
                      {u.role === "admin" && <Shield className="w-3 h-3" />}
                      {u.role === "seller" && <Store className="w-3 h-3" />}
                      {u.role === "buyer" && <UserIcon className="w-3 h-3" />}
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col gap-1">
                      {u.is_banned ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2.5 py-1 rounded-full w-fit">
                          <Ban className="w-3 h-3" />
                          Banned
                        </span>
                      ) : (
                        <UserStatus userId={u.id} size="sm" />
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">
                    {timeAgo(u.last_login_at)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/users/${u.id}`}
                        className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                        title="View Activity"
                      >
                        <Eye className="w-4 h-4 text-blue-600" />
                      </Link>
                      <UserActions
                        user={{
                          id: u.id,
                          username: u.username,
                          role: u.role,
                          is_banned: u.is_banned,
                        }}
                        currentAdminId={currentAdmin?.id || ""}
                      />
                    </div>
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

