import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  User,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Activity,
  ShoppingBag,
  Store,
  MessageCircle,
  AlertTriangle,
  LogIn,
  Eye,
  Package,
  Heart,
} from 'lucide-react'

const ACTION_ICONS: Record<string, any> = {
  login: LogIn,
  signup: User,
  product_view: Eye,
  product_create: Package,
  order_placed: ShoppingBag,
  order_paid: ShoppingBag,
  seller_request: Store,
  message_sent: MessageCircle,
  review_posted: MessageCircle,
  wishlist_add: Heart,
  report_submitted: AlertTriangle,
}

const ACTION_LABELS: Record<string, string> = {
  login: 'Logged in',
  signup: 'Signed up',
  product_view: 'Viewed product',
  product_create: 'Created product',
  order_placed: 'Placed order',
  order_paid: 'Paid for order',
  seller_request: 'Applied as seller',
  message_sent: 'Sent message',
  review_posted: 'Posted review',
  wishlist_add: 'Added to wishlist',
  report_submitted: 'Submitted report',
}

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (!profile) notFound()

  // Get activity logs
  const { data: activities } = await supabase
    .from('activity_logs')
    .select('*')
    .eq('user_id', id)
    .order('created_at', { ascending: false })
    .limit(50)

  // Get user stats
  const [ordersRes, productsRes, reviewsRes, messagesRes] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('buyer_id', id),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('seller_id', id),
    supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('buyer_id', id),
    supabase.from('messages').select('*', { count: 'exact', head: true }).eq('sender_id', id),
  ])

  const stats = [
    { label: 'Orders', value: ordersRes.count || 0, icon: ShoppingBag, color: 'text-blue-600' },
    { label: 'Products', value: productsRes.count || 0, icon: Package, color: 'text-purple-600' },
    { label: 'Reviews', value: reviewsRes.count || 0, icon: MessageCircle, color: 'text-green-600' },
    { label: 'Messages', value: messagesRes.count || 0, icon: MessageCircle, color: 'text-orange-600' },
  ]

  const formatDate = (date: string | null) => {
    if (!date) return 'Never'
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

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
    <div className="space-y-6">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-600 text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Users
      </Link>

      {/* User Header */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold ${
            profile.role === 'admin' ? 'bg-red-600' :
            profile.role === 'seller' ? 'bg-blue-600' : 'bg-purple-600'
          }`}>
            {(profile.username || 'U')[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold dark:text-white">
              {profile.username || 'Unknown'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {profile.full_name || 'No name set'}
            </p>
            <div className="flex gap-2 mt-2">
              <span className={`text-xs px-2 py-1 rounded-full ${
                profile.role === 'admin' ? 'bg-red-100 text-red-700' :
                profile.role === 'seller' ? 'bg-blue-100 text-blue-700' :
                'bg-purple-100 text-purple-700'
              }`}>
                {profile.role?.toUpperCase()}
              </span>
              {profile.is_banned && (
                <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">
                  BANNED
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-sm dark:text-gray-300">{profile.username}@user</span>
          </div>
          {profile.country && (
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm dark:text-gray-300">{profile.country}</span>
            </div>
          )}
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm dark:text-gray-300">
              Joined: {formatDate(profile.created_at)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <LogIn className="w-4 h-4 text-gray-400" />
            <span className="text-sm dark:text-gray-300">
              Last login: {formatDate(profile.last_login_at)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm dark:text-gray-300">
              Last active: {formatDate(profile.last_active_at)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Activity className="w-4 h-4 text-gray-400" />
            <span className="text-sm dark:text-gray-300">
              Total logins: {profile.login_count || 0}
            </span>
          </div>
          {profile.last_login_ip && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">IP:</span>
              <span className="text-sm font-mono dark:text-gray-300">
                {profile.last_login_ip}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700 p-4">
              <Icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
              <p className="text-2xl font-bold dark:text-white">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Activity Log */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 dark:text-white">
          <Activity className="w-5 h-5 text-purple-600" />
          Recent Activity ({activities?.length || 0})
        </h2>

        {activities && activities.length > 0 ? (
          <div className="space-y-3">
            {activities.map((activity: any) => {
              const Icon = ACTION_ICONS[activity.action] || Activity
              const label = ACTION_LABELS[activity.action] || activity.action

              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-slate-900/50 rounded-lg"
                >
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg flex-shrink-0">
                    <Icon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium dark:text-white">
                      {label}
                    </p>
                    {activity.entity_type && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.entity_type}: {activity.entity_id?.slice(0, 20)}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-400">
                        {timeAgo(activity.created_at)}
                      </span>
                      {activity.ip_address && (
                        <span className="text-xs text-gray-400 font-mono">
                          {activity.ip_address}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Activity className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No activity yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
