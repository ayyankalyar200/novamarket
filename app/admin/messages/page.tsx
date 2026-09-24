import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { MessageCircle, Package, User, Store } from "lucide-react"

export default async function AdminMessagesPage() {
  const supabase = await createClient()

  const { data: conversations } = await supabase
    .from("conversations")
    .select(`
      *,
      buyer:buyer_id (id, username, role),
      seller:seller_id (id, username, role, store_name),
      products (id, title, images)
    `)
    .order("last_message_at", { ascending: false })

  const timeAgo = (date: string) => {
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-purple-600" />
          All Conversations
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          {conversations?.length || 0} total conversations between buyers and sellers
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700 p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Chats</p>
          <p className="text-2xl font-bold dark:text-white">
            {conversations?.length || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700 p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">Product Chats</p>
          <p className="text-2xl font-bold dark:text-white">
            {conversations?.filter((c: any) => c.product_id).length || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700 p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">Unread Messages</p>
          <p className="text-2xl font-bold dark:text-white">
            {conversations?.reduce(
              (sum: number, c: any) =>
                sum + (c.buyer_unread_count || 0) + (c.seller_unread_count || 0),
              0
            ) || 0}
          </p>
        </div>
      </div>

      {/* Conversations List */}
      {conversations && conversations.length > 0 ? (
        <div className="space-y-3">
          {conversations.map((conv: any) => (
            <div
              key={conv.id}
              className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 p-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-purple-600" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Chat #{conv.id.slice(0, 8).toUpperCase()}
                  </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {timeAgo(conv.last_message_at)}
                </span>
              </div>

              {/* Participants */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                {/* Buyer */}
                <div className="flex items-center gap-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <User className="w-4 h-4 text-purple-600" />
                  <div className="min-w-0">
                    <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                      Buyer
                    </p>
                    <p className="text-sm font-medium truncate dark:text-white">
                      @{conv.buyer?.username}
                    </p>
                  </div>
                  {conv.buyer_unread_count > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {conv.buyer_unread_count}
                    </span>
                  )}
                </div>

                {/* Seller */}
                <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Store className="w-4 h-4 text-blue-600" />
                  <div className="min-w-0">
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      Seller
                    </p>
                    <p className="text-sm font-medium truncate dark:text-white">
                      {conv.seller?.store_name || `@${conv.seller?.username}`}
                    </p>
                  </div>
                  {conv.seller_unread_count > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {conv.seller_unread_count}
                    </span>
                  )}
                </div>
              </div>

              {/* Product Context */}
              {conv.products && (
                <Link
                  href={`/product/${conv.products.id}`}
                  className="flex items-center gap-2 mb-3 p-2 bg-gray-50 dark:bg-slate-900/50 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-900"
                >
                  <Package className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    About: <strong>{conv.products.title}</strong>
                  </span>
                </Link>
              )}

              {/* Last Message */}
              <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Last message:
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                  {conv.last_message_preview || "No messages yet"}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl border-2 border-dashed dark:border-slate-700">
          <MessageCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
            No conversations yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Buyer-seller chats will appear here
          </p>
        </div>
      )}
    </div>
  )
}
