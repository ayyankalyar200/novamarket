import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MessageCircle, Package } from "lucide-react"

export default async function MessagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: conversations } = await supabase
    .from("conversations")
    .select(`
      *,
      buyer:buyer_id (id, username, avatar_url),
      seller:seller_id (id, username, avatar_url),
      products (id, title, images)
    `)
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order("last_message_at", { ascending: false })

  const formatTime = (date: string) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (mins < 1) return "Just now"
    if (mins < 60) return `${mins}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return d.toLocaleDateString()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          Messages
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {conversations?.length || 0} conversation{conversations?.length !== 1 ? "s" : ""}
        </p>
      </div>

      {conversations && conversations.length > 0 ? (
        <div className="space-y-2">
          {conversations.map((conv: any) => {
            const isBuyer = conv.buyer_id === user.id
            const otherUser = isBuyer ? conv.seller : conv.buyer
            const unreadCount = isBuyer
              ? conv.buyer_unread_count
              : conv.seller_unread_count

            return (
              <Link
                key={conv.id}
                href={`/messages/${conv.id}`}
                className="block bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 p-4 hover:shadow-lg transition"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg">
                      {otherUser?.username?.[0]?.toUpperCase() || "U"}
                    </div>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-gray-900 dark:text-white truncate">
                          {otherUser?.username || "User"}
                        </p>
                        <UserStatus userId={otherUser?.id || ''} size="sm" />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                        {formatTime(conv.last_message_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {conv.last_message_preview || "No messages yet"}
                    </p>
                    {conv.products && (
                      <div className="flex items-center gap-2 mt-2">
                        <Package className="w-3 h-3 text-purple-600" />
                        <span className="text-xs text-purple-600 dark:text-purple-400 truncate">
                          About: {conv.products.title}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl border-2 border-dashed dark:border-slate-700">
          <MessageCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
            No messages yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Start chatting with buyers and sellers
          </p>
          <Link
            href="/products"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-medium"
          >
            Browse Products
          </Link>
        </div>
      )}
    </div>
  )
}

