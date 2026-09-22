'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRecaptcha } from '@/lib/use-recaptcha'
import {
  Mail,
  Lock,
  User,
  Loader2,
  Store,
  Briefcase,
  Phone,
  MapPin,
  FileText,
  Check,
  AlertCircle,
} from 'lucide-react'

const CATEGORIES = [
  { value: 'electronics', label: '💻 Electronics & Gadgets' },
  { value: 'fashion', label: '👕 Fashion & Clothing' },
  { value: 'home', label: '🏠 Home & Furniture' },
  { value: 'books', label: '📚 Books & Media' },
  { value: 'sports', label: '⚽ Sports & Outdoors' },
  { value: 'toys', label: '🧸 Toys & Games' },
  { value: 'beauty', label: '💄 Beauty & Health' },
  { value: 'automotive', label: '🚗 Automotive' },
  { value: 'collectibles', label: '🎨 Collectibles & Art' },
  { value: 'other', label: '📦 Other' },
]

export default function SellerSignupPage() {
  const router = useRouter()
  const { getToken } = useRecaptcha()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1) // Step 1: Account, Step 2: Store Info

  // Account
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')

  // Store
  const [form, setForm] = useState({
    store_name: '',
    store_description: '',
    store_category: '',
    phone: '',
    address: '',
    tax_id: '',
    terms_accepted: false,
  })

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // reCAPTCHA
      const recaptchaToken = await getToken('seller_signup')
      if (recaptchaToken) {
        await fetch('/api/recaptcha/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: recaptchaToken }),
        }).catch(() => {})
      }

      // Create account
      const supabase = createClient()
      const { error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username, role: 'seller' },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (signupError) throw signupError

      // Move to step 2
      setStep(2)
      setLoading(false)
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/become-seller', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed')

      router.push(`/become-seller?success=true&id=${data.request_id}`)
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              step >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {step > 1 ? <Check className="w-5 h-5" /> : '1'}
            </div>
            <div className={`h-1 w-20 ${step >= 2 ? 'bg-purple-600' : 'bg-gray-200'}`} />
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              step >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              {step === 1 ? 'Create Seller Account' : 'Set Up Your Store'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {step === 1 
                ? 'Become a seller on NovaMarket — no buyer account needed'
                : 'Tell us about your store'}
            </p>
          </div>
        </div>

        {/* Step 1: Account */}
        {step === 1 && (
          <form onSubmit={handleStep1} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-white">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  minLength={3}
                  placeholder="yourstore"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 dark:text-white">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 dark:text-white">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">At least 6 characters</p>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg border border-red-200 dark:border-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Creating account...' : 'Continue'}
            </button>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Already a seller?{' '}
              <Link href="/login" className="text-purple-600 font-medium hover:underline">
                Login
              </Link>
            </p>

            <p className="text-center text-xs text-gray-400">
              Want to buy instead?{' '}
              <Link href="/signup" className="text-purple-600 hover:underline">
                Buyer signup
              </Link>
            </p>
          </form>
        )}

        {/* Step 2: Store Info */}
        {step === 2 && (
          <form onSubmit={handleStep2} className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-3 mb-4">
              <p className="text-sm text-green-800 dark:text-green-300 flex items-center gap-2">
                <Check className="w-4 h-4" />
                Account created! Complete your store details.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 dark:text-white">Store Name *</label>
              <input
                type="text"
                value={form.store_name}
                onChange={(e) => setForm({ ...form, store_name: e.target.value })}
                required
                minLength={3}
                placeholder="e.g. Your Store Name"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 dark:text-white">Description *</label>
              <textarea
                value={form.store_description}
                onChange={(e) => setForm({ ...form, store_description: e.target.value })}
                required
                minLength={20}
                rows={3}
                placeholder="Describe your store (20-500 chars)"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-white">Category *</label>
                <select
                  value={form.store_category}
                  onChange={(e) => setForm({ ...form, store_category: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 dark:text-white">Phone *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                  minLength={10}
                  placeholder="+92 300 1234567"
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 dark:text-white">Business Address *</label>
              <textarea
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                required
                minLength={10}
                rows={2}
                placeholder="Street, City, Country"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 dark:text-white">Tax ID (optional)</label>
              <input
                type="text"
                value={form.tax_id}
                onChange={(e) => setForm({ ...form, tax_id: e.target.value })}
                placeholder="Business tax registration"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.terms_accepted}
                onChange={(e) => setForm({ ...form, terms_accepted: e.target.checked })}
                required
                className="mt-1"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                I agree to NovaMarket's Seller Terms
              </span>
            </label>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg border border-red-200 dark:border-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !form.terms_accepted}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
