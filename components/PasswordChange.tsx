'use client'

import { useState } from 'react'
import { Lock, Loader2, Check, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function PasswordChange() {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [show, setShow] = useState({
    current: false,
    newPass: false,
    confirm: false,
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (form.newPassword.length < 6) {
      setError('New password must be at least 6 characters')
      return
    }

    if (form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match')
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()

      // Try updateUser with current_password field directly
      const { error: updateError } = await supabase.auth.updateUser({
        password: form.newPassword,
        current_password: form.currentPassword,
      } as any)

      if (updateError) {
        // Agar current_password field reject ho to alternative
        if (updateError.message.includes('current password')) {
          // Step 1: Pehle re-authenticate
          const { data: { user } } = await supabase.auth.getUser()
          if (!user?.email) throw new Error('User not found')

          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: user.email,
            password: form.currentPassword,
          })

          if (signInError) {
            throw new Error('Current password is incorrect')
          }

          // Step 2: Phir update
          const { error: retryError } = await supabase.auth.updateUser({
            password: form.newPassword,
          })

          if (retryError) throw retryError
        } else {
          throw updateError
        }
      }

      setSuccess(true)
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => setSuccess(false), 5000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border p-6">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <Lock className="w-5 h-5 text-purple-600" />
        Change Password
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Current Password
          </label>
          <div className="relative">
            <input
              type={show.current ? 'text' : 'password'}
              value={form.currentPassword}
              onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
              required
              placeholder="Enter current password"
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="button"
              onClick={() => setShow({ ...show, current: !show.current })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {show.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            New Password
          </label>
          <div className="relative">
            <input
              type={show.newPass ? 'text' : 'password'}
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              required
              minLength={6}
              placeholder="At least 6 characters"
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="button"
              onClick={() => setShow({ ...show, newPass: !show.newPass })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {show.newPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={show.confirm ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              required
              minLength={6}
              placeholder="Re-enter new password"
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="button"
              onClick={() => setShow({ ...show, confirm: !show.confirm })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {show.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg border border-red-200 text-sm mt-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-700 p-3 rounded-lg border border-green-200 text-sm mt-4 flex items-center gap-2">
          <Check className="w-4 h-4" />
          Password updated successfully!
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium flex items-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Updating...
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            Update Password
          </>
        )}
      </button>
    </form>
  )
}
