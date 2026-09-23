'use client'

import Link from 'next/link'
import { Search, ShoppingCart, Shield, Store, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import UserMenu from './UserMenu'
import ThemeToggle from './ThemeToggle'
import NotificationBell from './notifications/NotificationBell'
import { useCart } from '@/lib/cart-context'
import { createClient } from '@/lib/supabase/client'

export default function Header() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const { totalItems } = useCart()
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    const getRole = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setUserRole(null)
        return
      }
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      setUserRole(data?.role || 'buyer')
    }
    getRole()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single()
          setUserRole(data?.role || 'buyer')
        } else {
          setUserRole(null)
        }
      }
    )
    return () => subscription.unsubscribe()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const isAdmin = userRole === 'admin'
  const isSeller = userRole === 'seller' || isAdmin

  return (
    <header className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              NovaMarket
            </h1>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <button
                type="button"
                onClick={() => router.push('/ai-search')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md hover:opacity-90 transition"
                title="AI Search"
              >
                <Sparkles className="w-4 h-4" />
              </button>
              <input
                type="text"
                placeholder="Search products, brands, and categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-12 py-2 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white"
              />
            </div>
          </form>

          {/* Right Icons */}
          <div className="flex items-center gap-2">
            {/* Admin Quick Button */}
            {isAdmin && (
              <Link
                href="/admin/dashboard"
                className="hidden md:flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
                title="Admin Panel"
              >
                <Shield className="w-4 h-4" />
                Admin
              </Link>
            )}

            {/* Seller Quick Button */}
            {isSeller && !isAdmin && (
              <Link
                href="/dashboard/seller"
                className="hidden md:flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
                title="Seller Dashboard"
              >
                <Store className="w-4 h-4" />
                Sell
              </Link>
            )}

            {/* THEME TOGGLE - ALWAYS VISIBLE */}
            <NotificationBell />
            <ThemeToggle />

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700 dark:text-gray-200" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            <UserMenu />
          </div>
        </div>
      </div>

      {/* Categories Strip */}
      <div className="border-t dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <nav className="flex items-center gap-6 overflow-x-auto text-sm">
            <Link href="/products" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 whitespace-nowrap">
              All Products
            </Link>
            <Link href="/ai-search" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 whitespace-nowrap font-medium flex items-center gap-1">
              ✨ AI Search
            </Link>
            <Link href="/products?category=electronics" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 whitespace-nowrap">
              💻 Electronics
            </Link>
            <Link href="/products?category=fashion" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 whitespace-nowrap">
              👕 Fashion
            </Link>
            <Link href="/products?category=home" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 whitespace-nowrap">
              🏠 Home
            </Link>
            <Link href="/products?category=books" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 whitespace-nowrap">
              📚 Books
            </Link>
            <Link href="/products?category=sports" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 whitespace-nowrap">
              ⚽ Sports
            </Link>
            <Link href="/products?category=toys" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 whitespace-nowrap">
              🧸 Toys
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}



