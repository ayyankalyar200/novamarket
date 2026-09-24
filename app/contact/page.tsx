import { SITE_CONFIG } from '@/lib/data/site-config'
import { Mail, MessageCircle, Globe, MapPin, Clock, Send } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Contact Us — NovaMarket',
  description: 'Get in touch with NovaMarket support team',
}

export default function ContactPage() {
  const contactMethods = [
    {
      icon: Mail,
      label: 'Email',
      value: SITE_CONFIG.email,
      href: `mailto:${SITE_CONFIG.email}`,
      color: 'purple',
      description: 'Best for detailed questions',
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: SITE_CONFIG.whatsapp,
      href: SITE_CONFIG.whatsappLink,
      color: 'green',
      description: 'Fastest response',
    },
    {
      icon: Globe,
      label: 'Website',
      value: 'nova-market-09.vercel.app',
      href: SITE_CONFIG.website,
      color: 'blue',
      description: 'Browse our marketplace',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
          Contact Us
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400">
          We're here to help — reach out anytime
        </p>
      </div>

      {/* Contact Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {contactMethods.map((method) => {
          const Icon = method.icon
          return (
            <a
              key={method.label}
              href={method.href}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 p-6 hover:shadow-lg transition text-center"
            >
              <div
                className={`bg-${method.color}-100 dark:bg-${method.color}-900/30 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4`}
              >
                <Icon className={`w-7 h-7 text-${method.color}-600`} />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                {method.label}
              </h3>
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-2 break-all">
                {method.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {method.description}
              </p>
            </a>
          )
        })}
      </div>

      {/* Support Hours */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="bg-yellow-100 dark:bg-yellow-900/30 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
              Support Hours
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-1">
              🕐 {SITE_CONFIG.supportHours}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              📧 Average response time: <strong>{SITE_CONFIG.responseTime}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Contact Info Card */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white mb-8">
        <h2 className="text-2xl font-bold mb-4">Send us a message</h2>
        <p className="mb-6 opacity-90">
          For any inquiries, partnerships, or support, reach out to us:
        </p>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5" />
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="hover:underline font-medium"
            >
              {SITE_CONFIG.email}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <MessageCircle className="w-5 h-5" />
            <a
              href={SITE_CONFIG.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline font-medium"
            >
              {SITE_CONFIG.whatsapp}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5" />
            <span>{SITE_CONFIG.country}</span>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 p-6">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Quick Help</h2>
        <div className="space-y-3">
          <Link href="/help" className="block p-3 bg-gray-50 dark:bg-slate-900/50 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 transition">
            <p className="font-medium text-gray-900 dark:text-white">📚 Help Center</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Browse FAQs and guides</p>
          </Link>
          <Link href="/buyer-protection" className="block p-3 bg-gray-50 dark:bg-slate-900/50 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 transition">
            <p className="font-medium text-gray-900 dark:text-white">🛡️ Buyer Protection</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Learn about our protection policy</p>
          </Link>
          <Link href="/returns" className="block p-3 bg-gray-50 dark:bg-slate-900/50 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 transition">
            <p className="font-medium text-gray-900 dark:text-white">↩️ Returns & Refunds</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">How to return an item</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
