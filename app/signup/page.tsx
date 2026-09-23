'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRecaptcha } from '@/lib/use-recaptcha'
import {
  Mail,
  Lock,
  User,
  Loader2,
  ShoppingBag,
  Store,
  CheckCircle,
  ArrowLeft,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Inbox,
} from 'lucide-react'

// ============================================
// INNER COMPONENT
// ============================================
function SignupContent() {
  const { getToken } = useRecaptcha()
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialRole = searchParams.get('role') === 'seller' ? 'seller' : 'buyer'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [role, setRole] = useState<'buyer' | 'seller'>(initialRole)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [resending, setResending] = useState(false)
  const [resentSuccess, setResentSuccess] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // reCAPTCHA verification
    const recaptchaToken = await getToken('signup')
    if (!recaptchaToken) {
      setError('Security verification failed. Please try again.')
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, role },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (signupError) {
      setError(signupError.message)
      setLoading(false)
      return
    }

    setEmailSent(true)
    setLoading(false)
  }

  const handleResendEmail = async () => {
    setResending(true)
    setError('')
    setResentSuccess(false)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      setResentSuccess(true)
      setTimeout(() => setResentSuccess(false), 5000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setResending(false)
    }
  }

  const getEmailProvider = (email: string) => {
    const domain = email.split('@')[1]?.toLowerCase()
    if (domain === 'gmail.com' || domain === 'googlemail.com') {
      return { name: 'Gmail', url: 'https://mail.google.com', color: 'bg-red-500 hover:bg-red-600', icon: '📧' }
    }
    if (domain === 'outlook.com' || domain === 'hotmail.com' || domain === 'live.com') {
      return { name: 'Outlook', url: 'https://outlook.live.com', color: 'bg-blue-500 hover:bg-blue-600', icon: '📨' }
    }
    if (domain === 'yahoo.com') {
      return { name: 'Yahoo Mail', url: 'https://mail.yahoo.com', color: 'bg-purple-500 hover:bg-purple-600', icon: '📩' }
    }
    if (domain === 'icloud.com' || domain === 'me.com') {
      return { name: 'iCloud Mail', url: 'https://www.icloud.com/mail', color: 'bg-blue-400 hover:bg-blue-500', icon: '✉️' }
    }
    return { name: 'Email App', url: `https://${domain}`, color: 'bg-gray-600 hover:bg-gray-700', icon: '📧' }
  }

  if (emailSent) {
    const provider = getEmailProvider(email)

    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Inbox className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Check Your Email</h1>
            <p className="text-gray-600">We've sent a confirmation link to your email address</p>
          </div>

          <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-600 p-2 rounded-lg">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-purple-600 font-medium mb-0.5">Confirmation email sent to</p>
                <p className="font-bold text-gray-900 truncate">{email}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 font-medium mb-2">📬 Next Steps:</p>
            <ol className="text-sm text-blue-700 space-y-1.5 list-decimal list-inside">
              <li>Open your email inbox</li>
              <li>Look for email from <strong>NovaMarket</strong></li>
              <li>Click the <strong>"Confirm Email"</strong> link</li>
              <li>You'll be redirected back to login</li>
            </ol>
          </div>

          <a
            href={provider.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full ${provider.color} text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition mb-3`}
          >
            <span className="text-xl">{provider.icon}</span>
            Open {provider.name}
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            onClick={handleResendEmail}
            disabled={resending}
            className="w-full py-3 border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 flex items-center justify-center gap-2 mb-3"
          >
            {resending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Resend Confirmation Email
              </>
            )}
          </button>

          {resentSuccess && (
            <div className="bg-green-50 text-green-700 p-3 rounded-lg border border-green-200 text-sm mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Email resent successfully!
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg border border-red-200 text-sm mb-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="text-center space-y-2">
            <button
              onClick={() => {
                setEmailSent(false)
                setEmail('')
                setPassword('')
                setUsername('')
              }}
              className="text-sm text-purple-600 hover:underline font-medium"
            >
              Wrong email? Try again
            </button>
          </div>

          <div className="mt-6 pt-6 border-t text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-600 mb-2">Join NovaMarket</h1>
          <p className="text-gray-500">Create your account in seconds</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">I want to</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('buyer')}
                className={`p-4 rounded-lg border-2 transition flex flex-col items-center gap-2 ${
                  role === 'buyer' ? 'border-purple-600 bg-purple-50 text-purple-600' : 'border-gray-200 text-gray-600'
                }`}
              >
                <ShoppingBag className="w-6 h-6" />
                <span className="font-medium">Buy</span>
              </button>
              <button
                type="button"
                onClick={() => router.push('/seller-signup')}
                className={`p-4 rounded-lg border-2 transition flex flex-col items-center gap-2 ${
                  role === 'seller' ? 'border-purple-600 bg-purple-50 text-purple-600' : 'border-gray-200 text-gray-600'
                }`}
              >
                <Store className="w-6 h-6" />
                <span className="font-medium">Sell</span>
              </button>
            </div>
            {role === 'seller' && (
              <p className="text-xs text-gray-500 mt-2 bg-yellow-50 border border-yellow-200 rounded p-2">
                ⚠️ Seller accounts require admin approval.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="johndoe"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">At least 6 characters</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-purple-600 font-medium hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}

// ============================================
// MAIN PAGE
// ============================================
export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      }
    >
      <SignupContent />
    </Suspense>
  )
}


