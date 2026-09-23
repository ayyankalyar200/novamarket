'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  Store,
  Loader2,
  Check,
  AlertCircle,
  ArrowLeft,
  Phone,
  MapPin,
  Briefcase,
  FileText,
  DollarSign,
  Shield,
  TrendingUp,
  Users,
  Sparkles,
  CheckCircle,
  Clock,
  Mail,
  Home,
  Package,
} from 'lucide-react'
import CountrySelect from '@/components/ui/CountrySelect'
import PhoneInput from '@/components/ui/PhoneInput'
import LocationInput from '@/components/ui/LocationInput'
import { getDefaultCountry, Country } from '@/lib/data/countries'
import { useRecaptcha } from '@/lib/use-recaptcha'

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

export default function BecomeSellerPage() {
  const { getToken } = useRecaptcha()
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)
  const [requestId, setRequestId] = useState<string>('')
  const [selectedCountry, setSelectedCountry] = useState<Country>(getDefaultCountry())
  const [locationValid, setLocationValid] = useState(false)

  const [form, setForm] = useState({
    store_name: '',
    store_description: '',
    store_category: '',
    phone: '',
    address: '',
    address_detail: '',
    tax_id: '',
    terms_accepted: false,
  })

  useEffect(() => {
    const check = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login?redirect=/become-seller')
        return
      }
      setUser(user)

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      // Block already-sellers/admins
      if (profile?.role === 'seller' || profile?.role === 'admin') {
        router.push('/dashboard/seller')
        return
      }

      // Allow ANYONE else (buyers, new users) to apply as seller
      // Remove buyer-only requirement

      const { data: existing } = await supabase
        .from('seller_requests')
        .select('id, status')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .single()

      if (existing) {
        setSubmitted(true)
        setRequestId(existing.id)
        setChecking(false)
        return
      }

      setChecking(false)
    }
    check()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!locationValid) {
      setError('Please select a valid location from the dropdown')
      return
    }

    // reCAPTCHA verification
    const recaptchaToken = await getToken('become_seller')
    if (recaptchaToken) {
      try {
        const verifyRes = await fetch('/api/recaptcha/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: recaptchaToken }),
        })

        const verifyData = await verifyRes.json()

        if (!verifyRes.ok) {
          setError(verifyData.error || 'Security verification failed')
          setSubmitting(false)
          return
        }
      } catch (err: any) {
        console.error('reCAPTCHA error:', err)
        // Continue - don't block user if reCAPTCHA fails
      }
    }

    if (!locationValid) {
      setError('Please select a valid location from the dropdown')
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch('/api/become-seller', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          phone: `${selectedCountry.dialCode} ${form.phone}`,
          address: form.address_detail
            ? `${form.address} — ${form.address_detail}`
            : form.address,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      setRequestId(data.request_id || '')
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    )
  }

  // ============================================
  // SUCCESS SCREEN
  // ============================================
  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 text-white text-center">
            <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Application Submitted!</h1>
            <p className="text-green-50 text-lg">
              Your seller application has been received successfully
            </p>
          </div>

          <div className="p-8">
            {requestId && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-center border">
                <p className="text-xs text-gray-500 mb-1">APPLICATION ID</p>
                <p className="font-mono font-bold text-gray-900">
                  #{requestId.slice(0, 8).toUpperCase()}
                </p>
              </div>
            )}

            <h2 className="text-xl font-bold mb-4 text-gray-900">
              📋 What happens next?
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Application Received</p>
                  <p className="text-sm text-gray-500">
                    Your application is in our review queue
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Admin Review (24-48 hours)</p>
                  <p className="text-sm text-gray-500">
                    Our team will review your application. You'll get an email once approved.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Store className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Start Selling</p>
                  <p className="text-sm text-gray-500">
                    Once approved, list products and start earning
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Check your email</p>
                  <p className="text-xs text-blue-700 mt-1">
                    We'll send updates to <strong>{user?.email}</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/"
                className="flex-1 py-3 border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Back to Home
              </Link>
              <Link
                href="/products"
                className="flex-1 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 flex items-center justify-center gap-2"
              >
                <Package className="w-4 h-4" />
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ============================================
  // FORM
  // ============================================
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/profile"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-600 mb-6 text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Profile
      </Link>

      {/* Hero */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl p-8 text-white mb-8">
        <div className="flex items-start gap-4">
          <div className="bg-white/20 p-3 rounded-xl">
            <Store className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Become a Seller</h1>
            <p className="text-lg opacity-90">
              Fill out this form to start selling on NovaMarket
            </p>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg border p-4">
          <div className="bg-green-100 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <p className="font-medium text-sm">Earn Money</p>
          <p className="text-xs text-gray-500 mt-1">Only 5% commission</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="font-medium text-sm">Global Reach</p>
          <p className="text-xs text-gray-500 mt-1">Millions of buyers</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="bg-purple-100 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <p className="font-medium text-sm">Analytics</p>
          <p className="text-xs text-gray-500 mt-1">Track sales</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="bg-orange-100 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
            <Shield className="w-5 h-5 text-orange-600" />
          </div>
          <p className="font-medium text-sm">Secure Payouts</p>
          <p className="text-xs text-gray-500 mt-1">Via Stripe</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Store className="w-5 h-5 text-purple-600" />
            Store Information
          </h2>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Store Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Store className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={form.store_name}
                onChange={(e) => setForm({ ...form, store_name: e.target.value })}
                required
                minLength={3}
                maxLength={50}
                placeholder="e.g. Ayyans Tech Store"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Store Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.store_description}
              onChange={(e) => setForm({ ...form, store_description: e.target.value })}
              required
              minLength={20}
              maxLength={500}
              rows={4}
              placeholder="Tell buyers about your store..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              {form.store_description.length} / 500 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Primary Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={form.store_category}
                onChange={(e) => setForm({ ...form, store_category: e.target.value })}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none bg-white"
              >
                <option value="">Select primary category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="p-6 border-t bg-gray-50">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
            <Phone className="w-5 h-5 text-purple-600" />
            Contact Information
          </h2>

          <div className="space-y-6">
            {/* Phone Input */}
            <PhoneInput
              country={selectedCountry}
              onCountryChange={setSelectedCountry}
              phone={form.phone}
              onPhoneChange={(phone) => setForm({ ...form, phone })}
              required
              label="Phone Number"
            />

            {/* Location Autocomplete */}
            <LocationInput
              value={form.address}
              onChange={(value) => setForm({ ...form, address: value })}
              onValidSelection={() => setLocationValid(true)}
              required
              label="Business Address"
              placeholder="Start typing your city (e.g. Karachi, Lahore, Dubai)"
            />

            {/* Street Address Detail - only after location selected */}
            {locationValid && (
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Street Address <span className="text-gray-400">(optional)</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <textarea
                    value={form.address_detail}
                    onChange={(e) => setForm({ ...form, address_detail: e.target.value })}
                    rows={2}
                    placeholder="Building number, street name, area..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            )}

            {/* Tax ID */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Tax ID / NTN <span className="text-gray-400">(optional)</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={form.tax_id}
                  onChange={(e) => setForm({ ...form, tax_id: e.target.value })}
                  placeholder="Business tax registration"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="p-6 border-t">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-sm text-purple-900 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Seller Agreement
            </h3>
            <ul className="text-xs text-purple-800 space-y-1">
              <li>• NovaMarket charges 5% commission on each sale</li>
              <li>• Payments via Stripe Connect</li>
              <li>• Ship orders within 3 business days</li>
              <li>• Respond to buyers within 24 hours</li>
            </ul>
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.terms_accepted}
              onChange={(e) => setForm({ ...form, terms_accepted: e.target.checked })}
              required
              className="mt-1 w-5 h-5 rounded border-gray-300 text-purple-600"
            />
            <span className="text-sm text-gray-700">
              I agree to the Seller Terms and confirm that all information is accurate.
            </span>
          </label>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-6 mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="p-6 border-t bg-gray-50 rounded-b-2xl flex gap-3">
          <Link
            href="/profile"
            className="flex-1 py-3 border-2 border-gray-300 rounded-lg font-medium hover:bg-white text-center"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting || !form.terms_accepted || !locationValid}
            className="flex-1 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                Submit Application
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}


