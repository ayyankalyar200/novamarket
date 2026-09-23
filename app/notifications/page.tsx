import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Bell, Check, ExternalLink } from 'lucide-react'

const TYPE_ICONS: Record<string, string> = {
  order_placed: '🎉',
  order_paid: '💰',
  order_shipped: '📦',
  order_delivered: '✅',
  message_received: '💬',
  review_posted: '⭐',
  seller_approved: '🎊',
  seller_rejected: '❌',
  product_hidden: '⚠️',
  user_banned: '🚫',
  price_dropped: '💸',
  back_in_stock: '📢',
  new_follower: '👥',
  admin_announcement: '📢',
  report_resolved: '✅',
}

export default async function NotificationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(100)

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return new Date(date).toLocaleDateString()
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white flex items-center gap-3">
          <Bell className="w-8 h-8 text-purple-600" />
          Notifications
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {notifications?.filter((n: any) => !n.is_read).length || 0} unread ·{' '}
          {notifications?.length || 0} total
        </p>
      </div>

      {notifications && notifications.length > 0 ? (
        <div className="space-y-2">
          {notifications.map((n: any) => (
            <Link
              key={n.id}
              href={n.link || '#'}
              className={`block p-4 bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700 hover:shadow-md transition ${
                !n.is_read ? 'border-l-4 border-l-purple-600' : ''
              }`}
            >
              <div className="flex gap-3">
                <span className="text-2xl flex-shrink-0">
                  {TYPE_ICONS[n.type] || '📢'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`${!n.is_read ? 'font-bold' : 'font-medium'} dark:text-white`}>
                      {n.title}
                    </p>
                    {!n.is_read && (
                      <span className="w-2 h-2 bg-purple-600 rounded-full flex-shrink-0 mt-2" />
                    )}
                  </div>
                  {n.message && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {n.message}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-gray-400">
                      {timeAgo(n.created_at)}
                    </span>
                    {n.link && (
                      <span className="text-xs text-purple-600 dark:text-purple-400 flex items-center gap-1">
                        View <ExternalLink className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl border-2 border-dashed dark:border-slate-700">
          <Bell className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
            No notifications yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            We'll notify you when something happens
          </p>
        </div>
      )}
    </div>
  )
}
