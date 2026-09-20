import { createClient } from "@/lib/supabase/server"
import { Flag } from "lucide-react"

export default async function AdminReportsPage() {
  const supabase = await createClient()

  const { data: reports } = await supabase
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
        <p className="text-gray-500 text-sm mt-1">
          {reports?.length || 0} reports
        </p>
      </div>

      {reports && reports.length > 0 ? (
        <div className="space-y-3">
          {reports.map((r: any) => (
            <div key={r.id} className="bg-white rounded-xl border p-4">
              <p className="text-sm">Report ID: {r.id.slice(0, 8)}</p>
              <p className="text-sm">Reason: {r.reason}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed">
          <Flag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">No reports yet</h3>
          <p className="text-gray-500">Reports will appear here</p>
        </div>
      )}
    </div>
  )
}
