'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User, LogOut, Package, Heart, Settings, ChevronDown, Store, Shield, MessageCircle } from 'lucide-react'

export default function UserMenu() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const supabase = createClient()

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(data)
      }
      setLoading(false)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null)
        if (session?.user) {
          supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
            .then(({ data }) => setProfile(data))
        } else {
          setProfile(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setOpen(false)
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
    )
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
      >
        <User className="w-4 h-4" />
        <span className="hidden sm:inline">Login</span>
      </Link>
    )
  }

  const initial = (profile?.username || user.email || 'U')[0].toUpperCase()
  const isSellerOrAdmin = profile?.role === 'seller' || profile?.role === 'admin'
  const isAdmin = profile?.role === 'admin'

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-full transition"
      >
        <div className={`w-9 h-9 text-white rounded-full flex items-center justify-center font-bold ${
          isAdmin ? 'bg-red-600' : 'bg-purple-600'
        }`}>
          {initial}
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-600 transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border z-50 overflow-hidden">
          {/* User info */}
          <div className={`p-4 border-b ${
            isAdmin ? 'bg-red-50' : 'bg-purple-50'
          }`}>
            <p className="font-semibold text-gray-900">
              {profile?.username || 'User'}
            </p>
            <p className="text-sm text-gray-600 truncate">{user.email}</p>
            {profile?.role && (
              <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full font-medium ${
                profile.role === 'admin'
                  ? 'bg-red-200 text-red-800'
                  : profile.role === 'seller'
                  ? 'bg-blue-200 text-blue-800'
                  : 'bg-purple-200 text-purple-800'
              }`}>
                {profile.role.toUpperCase()}
              </span>
            )}
          </div>

          {/* Admin Panel - SIRF ADMIN */}
          {isAdmin && (
            <Link
              href="/admin/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-sm border-b bg-red-50/50"
            >
              <Shield className="w-4 h-4 text-red-600" />
              <span className="font-bold text-red-600">Admin Panel</span>
            </Link>
          )}

          {/* Menu items */}
          <div className="py-2">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-sm"
            >
              <User className="w-4 h-4 text-gray-500" />
              My Profile
            </Link>

            <Link
              href="/orders"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-sm"
            >
              <Package className="w-4 h-4 text-gray-500" />
              My Orders
            </Link>

            <Link
              href="/messages"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-700 text-sm dark:text-gray-200"
            >
              <MessageCircle className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              Messages
            </Link>

            {profile?.role === 'buyer' && (
              <Link
                href="/seller-signup"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2 hover:bg-green-50 dark:hover:bg-green-900/20 text-sm text-green-700 dark:text-green-400"
              >
                <Store className="w-4 h-4" />
                Become a Seller
              </Link>
            )}

            <Link
              href="/wishlist"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-sm"
            >
              <Heart className="w-4 h-4 text-gray-500" />
              Wishlist
            </Link>
          </div>

          {/* Seller Dashboard - SIRF SELLER/ADMIN */}
          {isSellerOrAdmin && (
            <div className="border-t">
              <Link
                href="/dashboard/seller"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50 text-sm"
              >
                <Store className="w-4 h-4 text-purple-600" />
                <span className="font-medium text-purple-600">Seller Dashboard</span>
              </Link>
            </div>
          )}

          {/* Logout */}
          <div className="border-t">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 text-sm w-full"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}


