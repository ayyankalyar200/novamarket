'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  Loader2,
  User,
  Mail,
  MapPin,
  Camera,
  Save,
  Check,
  Package,
  Heart,
  ArrowRight,
  Store,
  Sparkles,
} from 'lucide-react'
import PasswordChange from '@/components/PasswordChange'

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({ products: 0, orders: 0, wishlist: 0 })

  const [form, setForm] = useState({
    username: '',
    full_name: '',
    country: '',
    avatar_url: '',
  })

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)

      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(prof)
      setForm({
        username: prof?.username || '',
        full_name: prof?.full_name || '',
        country: prof?.country || '',
        avatar_url: prof?.avatar_url || '',
      })

      const [productsRes, ordersRes, wishlistRes] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('seller_id', user.id),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('buyer_id', user.id),
        supabase.from('wishlists').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      ])

      setStats({
        products: productsRes.count || 0,
        orders: ordersRes.count || 0,
        wishlist: wishlistRes.count || 0,
      })

      setLoading(false)
    }
    init()
  }, [router])

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setUploading(true)
    setError('')

    try {
      const supabase = createClient()
      const fileName = `${user.id}/avatar-${Date.now()}-${file.name}`

      const { data, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(data.path)

      setForm({ ...form, avatar_url: urlData.publicUrl })
    } catch (err: any) {
      setError(`Upload failed: ${err.message}`)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess(false)

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile')
      }

      setSuccess(true)
      setProfile(data.profile)
      router.refresh()

      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    )
  }

  const isSeller = profile?.role === 'seller' || profile?.role === 'admin'

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">My Profile</h1>
        <p className="text-gray-500">Manage your account settings</p>
      </div>

      {/* BECOME A SELLER BANNER - sirf buyers ko dikhaye */}
      {!isSeller && (
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 mb-8 text-white">
          <div className="flex items-start gap-4 flex-wrap">
            <div className="bg-white/20 p-4 rounded-xl">
              <Store className="w-10 h-10" />
            </div>
            <div className="flex-1 min-w-[250px]">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <span className="text-xs font-bold uppercase tracking-wider text-yellow-300">
                  New Opportunity
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Start Selling on NovaMarket</h2>
              <p className="text-sm opacity-90 mb-4">
                Turn your passion into profit. Get your own store, reach millions of buyers worldwide, and earn money from every sale.
              </p>
              <div className="flex flex-wrap gap-3 text-xs">
                <div className="bg-white/20 px-3 py-1.5 rounded-full">
                  ✓ Only 5% commission
                </div>
                <div className="bg-white/20 px-3 py-1.5 rounded-full">
                  ✓ Free to start
                </div>
                <div className="bg-white/20 px-3 py-1.5 rounded-full">
                  ✓ Instant payouts
                </div>
              </div>
              <Link
                href="/become-seller"
                className="inline-flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition mt-4"
              >
                <Store className="w-5 h-5" />
                Become a Seller
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link
          href={isSeller ? '/dashboard/seller/products' : '/products'}
          className="bg-white rounded-lg border p-4 hover:shadow-lg transition flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Package className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Products</p>
              <p className="text-xl font-bold">{stats.products}</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400" />
        </Link>

        <Link
          href="/orders"
          className="bg-white rounded-lg border p-4 hover:shadow-lg transition flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Orders</p>
              <p className="text-xl font-bold">{stats.orders}</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400" />
        </Link>

        <Link
          href="/wishlist"
          className="bg-white rounded-lg border p-4 hover:shadow-lg transition flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <Heart className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Wishlist</p>
              <p className="text-xl font-bold">{stats.wishlist}</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Avatar Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border p-6 text-center">
            <div className="relative inline-block mb-4">
              {form.avatar_url ? (
                <img
                  src={form.avatar_url}
                  alt="Avatar"
                  className="w-32 h-32 rounded-full object-cover border-4 border-purple-100"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-purple-600 text-white flex items-center justify-center text-5xl font-bold">
                  {(profile?.username || user?.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full cursor-pointer hover:bg-purple-700 transition"
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                disabled={uploading}
              />
            </div>

            <h2 className="font-bold text-lg">{profile?.username || 'User'}</h2>
            <p className="text-sm text-gray-500 mb-2">{user?.email}</p>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
              profile?.role === 'seller'
                ? 'bg-blue-100 text-blue-700'
                : profile?.role === 'admin'
                ? 'bg-red-100 text-red-700'
                : 'bg-purple-100 text-purple-700'
            }`}>
              {profile?.role || 'buyer'}
            </span>

            <div className="mt-4 pt-4 border-t text-xs text-gray-500">
              Member since{' '}
              {new Date(profile?.created_at).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric',
              })}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg border p-6">
            <h3 className="font-bold text-lg mb-4">Edit Information</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    placeholder="Your full name"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Country
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    placeholder="e.g. Pakistan"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
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
                Profile updated successfully!
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </form>

          {/* Password Change */}
          <PasswordChange />
        </div>
      </div>
    </div>
  )
}
