import { createClient } from "@/lib/supabase/server"
import { Flag, AlertTriangle, User, Package, Clock, CheckCircle } from "lucide-react"
import ReportActions from "@/components/admin/ReportActions"

export default async function AdminReportsPage() {
  const supabase = await createClient()

  const { data: reports } = await supabase
    .from("reports")
    .select(`
      *,
      reporter:reporter_id (username),
      reported_user:reported_user_id (username, role),
      reported_product:reported_product_id (id, title, images, is_hidden)
    `)
    .order("created_at", { ascending: false })

  const pending = reports?.filter((r: any) => r.status === "pending") || []
  const reviewed = reports?.filter((r: any) => r.status !== "pending") || []

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-700"
      case "resolved": return "bg-green-100 text-green-700"
      case "dismissed": return "bg-gray-100 text-gray-700"
      case "reviewed": return "bg-blue-100 text-blue-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Reports Management
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {pending.length} pending · {reviewed.length} reviewed
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-yellow-600" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Pending</span>
          </div>
          <p className="text-2xl font-bold dark:text-white">{pending.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700 p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Reviewed</span>
          </div>
          <p className="text-2xl font-bold dark:text-white">{reviewed.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Flag className="w-4 h-4 text-red-600" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Total</span>
          </div>
          <p className="text-2xl font-bold dark:text-white">{reports?.length || 0}</p>
        </div>
      </div>

      {/* Pending Reports */}
      {pending.length > 0 && (
        <div>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2 dark:text-white">
            <Clock className="w-5 h-5 text-yellow-600" />
            Pending Reports ({pending.length})
          </h3>
          <div className="space-y-4">
            {pending.map((report: any) => (
              <div
                key={report.id}
                className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 p-6"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white capitalize">
                        {report.reason.replace("_", " ")}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        By @{report.reporter?.username} ·{" "}
                        {new Date(report.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(report.status)}`}>
                    {report.status.toUpperCase()}
                  </span>
                </div>

                {/* Target */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {report.reported_user && (
                    <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">Reported User</span>
                      </div>
                      <p className="font-medium text-sm dark:text-white">
                        @{report.reported_user.username}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        Role: {report.reported_user.role}
                      </p>
                    </div>
                  )}
                  {report.reported_product && (
                    <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Package className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">Reported Product</span>
                      </div>
                      <p className="font-medium text-sm dark:text-white truncate">
                        {report.reported_product.title}
                      </p>
                    </div>
                  )}
                </div>

                {/* Description */}
                {report.description && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-4">
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
                      Description
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {report.description}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <ReportActions
                  reportId={report.id}
                  reportedUserId={report.reported_user_id}
                  reportedProductId={report.reported_product_id}
                  isProductHidden={report.reported_product?.is_hidden || false}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviewed */}
      {reviewed.length > 0 && (
        <div>
          <h3 className="font-bold text-lg mb-4 dark:text-white">
            Reviewed ({reviewed.length})
          </h3>
          <div className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 overflow-hidden">
            <div className="divide-y dark:divide-slate-700">
              {reviewed.map((report: any) => (
                <div key={report.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm dark:text-white capitalize">
                      {report.reason.replace("_", " ")}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      by @{report.reporter?.username}
                    </p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusColor(report.status)}`}>
                    {report.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty */}
      {pending.length === 0 && reviewed.length === 0 && (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl border-2 border-dashed dark:border-slate-700">
          <Flag className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
            No reports yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Reports from users will appear here
          </p>
        </div>
      )}
    </div>
  )
}


