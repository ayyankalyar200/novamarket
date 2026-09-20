import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { FileText, Store, Phone, MapPin, Clock } from "lucide-react"
import RequestActions from "@/components/admin/RequestActions"

export default async function AdminRequestsPage() {
  const supabase = await createClient()

  const { data: requests } = await supabase
    .from("seller_requests")
    .select(`
      *,
      profiles:user_id (id, username, full_name, avatar_url)
    `)
    .order("created_at", { ascending: false })

  const pending = requests?.filter((r: any) => r.status === "pending") || []
  const reviewed = requests?.filter((r: any) => r.status !== "pending") || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Seller Requests</h2>
          <p className="text-gray-500 text-sm mt-1">
            {pending.length} pending · {reviewed.length} reviewed
          </p>
        </div>
      </div>

      {/* Pending Requests */}
      {pending.length > 0 && (
        <div>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            Pending Requests ({pending.length})
          </h3>
          <div className="space-y-4">
            {pending.map((request: any) => (
              <div key={request.id} className="bg-white rounded-xl border p-6">
                <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center font-bold text-purple-600 text-lg">
                      {(request.profiles?.username || "U")[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold">{request.profiles?.username || "Unknown"}</p>
                      <p className="text-xs text-gray-500">
                        {request.profiles?.full_name || "No name"}
                      </p>
                    </div>
                  </div>
                  <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full">
                    PENDING
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                      <Store className="w-3 h-3" />
                      Store Name
                    </div>
                    <p className="font-medium text-sm">{request.store_name}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                      <FileText className="w-3 h-3" />
                      Category
                    </div>
                    <p className="font-medium text-sm capitalize">{request.store_category}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                      <Phone className="w-3 h-3" />
                      Phone
                    </div>
                    <p className="font-medium text-sm">{request.phone}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                      <MapPin className="w-3 h-3" />
                      Address
                    </div>
                    <p className="font-medium text-sm">{request.address}</p>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-blue-600 font-medium mb-1">Description</p>
                  <p className="text-sm text-gray-700">{request.store_description}</p>
                </div>

                <RequestActions requestId={request.id} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviewed Requests */}
      {reviewed.length > 0 && (
        <div>
          <h3 className="font-bold text-lg mb-4">Reviewed ({reviewed.length})</h3>
          <div className="bg-white rounded-xl border overflow-hidden">
            <div className="divide-y">
              {reviewed.map((request: any) => (
                <div key={request.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center font-bold text-purple-600">
                      {(request.profiles?.username || "U")[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{request.profiles?.username}</p>
                      <p className="text-xs text-gray-500">{request.store_name}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    request.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {request.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {pending.length === 0 && reviewed.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">No requests yet</h3>
          <p className="text-gray-500">Seller requests will appear here</p>
        </div>
      )}
    </div>
  )
}
