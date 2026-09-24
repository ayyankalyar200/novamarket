import { SITE_CONFIG } from '@/lib/data/site-config'
import { FileText } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service — NovaMarket',
  description: 'NovaMarket Terms of Service',
}

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-10">
        <div className="bg-purple-100 dark:bg-purple-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-purple-600" />
        </div>
        <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
          Terms of Service
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Last updated: September 2026
        </p>
      </div>

      <div className="prose prose-purple dark:prose-invert max-w-none bg-white dark:bg-slate-800 rounded-2xl border dark:border-slate-700 p-8">
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Welcome to {SITE_CONFIG.name}. By accessing or using our marketplace, you agree to
          these Terms of Service. Please read them carefully.
        </p>

        <h2 className="text-xl font-bold mt-6 mb-3 dark:text-white">1. Acceptance of Terms</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          By creating an account, you agree to these terms. If you do not agree, please do not
          use our services.
        </p>

        <h2 className="text-xl font-bold mt-6 mb-3 dark:text-white">2. User Accounts</h2>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
          <li>You must be 13+ years old to use NovaMarket</li>
          <li>You are responsible for maintaining account security</li>
          <li>One person, one account — no duplicate accounts</li>
          <li>You must provide accurate information</li>
        </ul>

        <h2 className="text-xl font-bold mt-6 mb-3 dark:text-white">3. Buying & Selling</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          <strong>Buyers</strong> agree to pay for items purchased. <strong>Sellers</strong> agree to:
        </p>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
          <li>List accurate product information</li>
          <li>Ship items promptly (within 3 business days)</li>
          <li>Respond to buyer messages within 24 hours</li>
          <li>Comply with all applicable laws</li>
        </ul>

        <h2 className="text-xl font-bold mt-6 mb-3 dark:text-white">4. Prohibited Items</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          You may not list: illegal items, weapons, drugs, counterfeit goods, stolen property,
          or any item violating our community guidelines.
        </p>

        <h2 className="text-xl font-bold mt-6 mb-3 dark:text-white">5. Payments & Fees</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          During our founding phase, NovaMarket charges <strong>zero commission</strong>.
          All payments are processed securely via Stripe. Future fees will be communicated
          with 30 days notice.
        </p>

        <h2 className="text-xl font-bold mt-6 mb-3 dark:text-white">6. Returns & Refunds</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Buyers can request returns within 30 days. See our{' '}
          <a href="/returns" className="text-purple-600 hover:underline">Returns Policy</a> for details.
        </p>

        <h2 className="text-xl font-bold mt-6 mb-3 dark:text-white">7. Buyer Protection</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          All purchases are covered by our{' '}
          <a href="/buyer-protection" className="text-purple-600 hover:underline">Buyer Protection Policy</a>.
        </p>

        <h2 className="text-xl font-bold mt-6 mb-3 dark:text-white">8. Account Termination</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          We reserve the right to suspend or terminate accounts violating these terms.
        </p>

        <h2 className="text-xl font-bold mt-6 mb-3 dark:text-white">9. Limitation of Liability</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          NovaMarket is a platform connecting buyers and sellers. We are not responsible
          for disputes between users, but we do offer Buyer Protection.
        </p>

        <h2 className="text-xl font-bold mt-6 mb-3 dark:text-white">10. Changes to Terms</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          We may update these terms. Continued use means acceptance of updates.
        </p>

        <h2 className="text-xl font-bold mt-6 mb-3 dark:text-white">Contact</h2>
        <p className="text-gray-700 dark:text-gray-300">
          Questions? Email us at{' '}
          <a href={`mailto:${SITE_CONFIG.email}`} className="text-purple-600 hover:underline">
            {SITE_CONFIG.email}
          </a>
        </p>
      </div>
    </div>
  )
}
