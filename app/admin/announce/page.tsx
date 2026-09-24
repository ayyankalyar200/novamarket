'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Megaphone,
  Loader2,
  Check,
  AlertCircle,
  Send,
  Info,
  CheckCircle,
  AlertTriangle,
  Gift,
  Flame,
  Users,
  User,
  Store,
  Mail,
} from 'lucide-react'

const PRIORITIES = [
  { value: 'info', label: 'Info', icon: Info, color: 'blue' },
  { value: 'success', label: 'Success', icon: CheckCircle, color: 'green' },
  { value: 'warning', label: 'Warning', icon: AlertTriangle, color: 'yellow' },
  { value: 'promo', label: 'Promotion', icon: Gift, color: 'purple' },
  { value: 'urgent', label: 'Urgent', icon: Flame, color: 'red' },
]

const TARGETS = [
  { value: 'all', label: 'All Users', icon: Users, desc: 'Buyers + Sellers + Admins' },
  { value: 'buyers', label: 'Buyers Only', icon: User, desc: 'Only buyer accounts' },
  { value: 'sellers', label: 'Sellers Only', icon: Store, desc: 'Only seller accounts' },
  { value: 'admins', label: 'Admins Only', icon: Users, desc: 'Only admin accounts' },
]

const QUICK_TEMPLATES = [
  {
    title: '🎉 Welcome to NovaMarket',
    message: 'Thank you for joining our marketplace! Explore amazing products and start selling today.',
    target: 'all',
    priority: 'success',
  },
  {
    title: '🔥 Weekend Flash Sale',
    message: 'Get up to 50% off on selected products this weekend. Hurry, limited time offer!',
    target: 'buyers',
    priority: 'promo',
  },
  {
    title: '💰 Zero Commission for Sellers',
    message: 'Good news! During our founding phase, sellers pay ZERO commission. Start selling now!',
    target: 'sellers',
    priority: 'promo',
  },
  {
    title: '⚠️ Scheduled Maintenance',
    message: 'NovaMarket will undergo maintenance. Some features may be temporarily unavailable.',
    target: 'all',
    priority: 'warning',
  },
]

export default function AdminAnnouncePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [sendEmail, setSendEmail] = useState(false)

  const [form, setForm] = useState({
    title: '',
    message: '',
    link: '',
    target: 'all',
    priority: 'info',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/announce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          send_email: sendEmail,
        }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      setSuccess(
        `✅ Sent to ${data.notifications_sent} users${
          data.emails_sent ? ` + ${data.emails_sent} emails` : ''
        }`
      )

      setForm({
        title: '',
        message: '',
        link: '',
        target: 'all',
        priority: 'info',
      })
      setSendEmail(false)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const loadTemplate = (tpl: any) => {
    setForm({
      title: tpl.title,
      message: tpl.message,
      link: '',
      target: tpl.target,
      priority: tpl.priority,
    })
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Megaphone className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Send Announcement</h1>
        </div>
        <p className="text-white/90 text-sm">
          Broadcast messages to all users via notifications + email
        </p>
      </div>

      {/* Quick Templates */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 p-5">
        <h3 className="font-bold text-sm mb-3 dark:text-white">
          ⚡ Quick Templates
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {QUICK_TEMPLATES.map((tpl, i) => (
            <button
              key={i}
              onClick={() => loadTemplate(tpl)}
              className="text-left p-3 bg-gray-50 dark:bg-slate-900/50 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition border dark:border-slate-700"
            >
              <p className="font-medium text-sm dark:text-white">
                {tpl.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                {tpl.message}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 p-6 space-y-5"
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2 dark:text-white">
            Title *
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            maxLength={100}
            placeholder="e.g. 🎉 Weekend Flash Sale"
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium mb-2 dark:text-white">
            Message *
          </label>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
            maxLength={500}
            rows={4}
            placeholder="Write your announcement message..."
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {form.message.length}/500
          </p>
        </div>

        {/* Link (optional) */}
        <div>
          <label className="block text-sm font-medium mb-2 dark:text-white">
            Link <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
            placeholder="/products?category=electronics"
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium mb-2 dark:text-white">
            Priority
          </label>
          <div className="grid grid-cols-5 gap-2">
            {PRIORITIES.map((p) => {
              const Icon = p.icon
              return (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setForm({ ...form, priority: p.value })}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition ${
                    form.priority === p.value
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30'
                      : 'border-gray-200 dark:border-slate-600 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`w-5 h-5 text-${p.color}-600`} />
                  <span className="text-xs font-medium dark:text-white">
                    {p.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Target */}
        <div>
          <label className="block text-sm font-medium mb-2 dark:text-white">
            Send To
          </label>
          <div className="grid grid-cols-2 gap-3">
            {TARGETS.map((t) => {
              const Icon = t.icon
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setForm({ ...form, target: t.value })}
                  className={`flex items-start gap-3 p-3 rounded-lg border-2 transition text-left ${
                    form.target === t.value
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30'
                      : 'border-gray-200 dark:border-slate-600 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm dark:text-white">
                      {t.label}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t.desc}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Email Toggle */}
        <label className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg cursor-pointer border border-blue-200 dark:border-blue-700">
          <input
            type="checkbox"
            checked={sendEmail}
            onChange={(e) => setSendEmail(e.target.checked)}
            className="w-5 h-5 rounded"
          />
          <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <div>
            <p className="font-medium text-sm dark:text-white">
              Also send via Email
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Users will receive both in-app notification and email
            </p>
          </div>
        </label>

        {/* Error/Success */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg border border-red-200 dark:border-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm p-3 rounded-lg border border-green-200 dark:border-green-700 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            {success}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !form.title || !form.message}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg hover:opacity-90 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Send Announcement
            </>
          )}
        </button>
      </form>
    </div>
  )
}
