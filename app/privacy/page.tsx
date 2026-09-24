import { SITE_CONFIG } from '@/lib/data/site-config'
import { Lock } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy — NovaMarket',
  description: 'NovaMarket Privacy Policy',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-10">
        <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
          Privacy Policy
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Last updated: September 2026
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border dark:border-slate-700 p-8">
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Your privacy matters. This policy explains how {SITE_CONFIG.name} collects, uses,
          and protects your information.
        </p>

        <h2 className="text-xl font-bold mt-6 mb-3 dark:text-white">1. Information We Collect</h2>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
          <li><strong>Account info:</strong> username, email, password (encrypted)</li>
          <li><strong>Profile info:</strong> full name, country, avatar</li>
          <li><strong>Seller info:</strong> store name, description, phone, address</li>
          <li><strong>Activity:</strong> pages visited, products viewed, searches</li>
          <li><strong>Transaction info:</strong> orders, payments (via Stripe)</li>
          <li><strong>Device info:</strong> IP address, browser, OS</li>
        </ul>

        <h2 className="text-xl font-bold mt-6 mb-3 dark:text-white">2. How We Use Your Info</h2>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
          <li>Provide and improve our services</li>
          <li>Process orders and payments</li>
          <li>Send transactional emails and notifications</li>
          <li>Prevent fraud and abuse</li>
          <li>Comply with legal requirements</li>
        </ul>

        <h2 className="text-xl font-bold mt-6 mb-3 dark:text-white">3. Data Sharing</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          We never sell your personal data. We share data only with:
        </p>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
          <li><strong>Stripe</strong> — for payment processing</li>
          <li><strong>Supabase</strong> — for secure data storage</li>
          <li><strong>Resend</strong> — for email delivery</li>
          <li><strong>Google reCAPTCHA</strong> — for bot protection</li>
        </ul>

        <h2 className="text-xl font-bold mt-6 mb-3 dark:text-white">4. Data Security</h2>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
          <li>All data encrypted in transit (HTTPS/SSL)</li>
          <li>Passwords hashed, never stored in plain text</li>
          <li>RLS (Row-Level Security) enforced at database level</li>
          <li>Regular security audits</li>
        </ul>

        <h2 className="text-xl font-bold mt-6 mb-3 dark:text-white">5. Cookies</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          We use essential cookies for authentication and preferences. We don't use
          third-party tracking cookies.
        </p>

        <h2 className="text-xl font-bold mt-6 mb-3 dark:text-white">6. Your Rights</h2>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
          <li>Access your personal data</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your account</li>
          <li>Export your data</li>
        </ul>

        <h2 className="text-xl font-bold mt-6 mb-3 dark:text-white">7. Children's Privacy</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          NovaMarket is not intended for children under 13. We do not knowingly collect
          data from children.
        </p>

        <h2 className="text-xl font-bold mt-6 mb-3 dark:text-white">8. Data Retention</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          We keep your data as long as your account is active. After deletion, we remove
          data within 30 days (except legal requirements).
        </p>

        <h2 className="text-xl font-bold mt-6 mb-3 dark:text-white">9. Contact Us</h2>
        <p className="text-gray-700 dark:text-gray-300">
          Questions about privacy? Email:{' '}
          <a href={`mailto:${SITE_CONFIG.email}`} className="text-purple-600 hover:underline">
            {SITE_CONFIG.email}
          </a>
        </p>
      </div>
    </div>
  )
}
