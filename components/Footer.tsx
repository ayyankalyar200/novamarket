import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/data/site-config'
import { Mail, MessageCircle, Globe } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold text-purple-400 mb-4">
              {SITE_CONFIG.name}
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              {SITE_CONFIG.description}
            </p>
            <div className="space-y-2 text-sm">
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition"
              >
                <Mail className="w-4 h-4" />
                {SITE_CONFIG.email}
              </a>
              <a
                href={SITE_CONFIG.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition"
              >
                <MessageCircle className="w-4 h-4" />
                {SITE_CONFIG.whatsapp}
              </a>
            </div>
          </div>

          {/* Buy */}
          <div>
            <h4 className="font-semibold mb-4">Buy</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/products" className="hover:text-purple-400">All Products</Link></li>
              <li><Link href="/wishlist" className="hover:text-purple-400">Wishlist</Link></li>
              <li><Link href="/orders" className="hover:text-purple-400">My Orders</Link></li>
              <li><Link href="/cart" className="hover:text-purple-400">Cart</Link></li>
              <li><Link href="/buyer-protection" className="hover:text-purple-400">Buyer Protection</Link></li>
            </ul>
          </div>

          {/* Sell */}
          <div>
            <h4 className="font-semibold mb-4">Sell</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/seller-signup" className="hover:text-purple-400">Start Selling</Link></li>
              <li><Link href="/dashboard/seller" className="hover:text-purple-400">Seller Dashboard</Link></li>
              <li><Link href="/dashboard/seller/coupons" className="hover:text-purple-400">Coupons</Link></li>
              <li><Link href="/pricing" className="hover:text-purple-400">Pricing</Link></li>
              <li><Link href="/about" className="hover:text-purple-400">About Us</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/help" className="hover:text-purple-400">Help Center</Link></li>
              <li><Link href="/returns" className="hover:text-purple-400">Returns & Refunds</Link></li>
              <li><Link href="/contact" className="hover:text-purple-400">Contact Us</Link></li>
              <li><Link href="/terms" className="hover:text-purple-400">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-purple-400">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © {SITE_CONFIG.founded} {SITE_CONFIG.name}. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                🌍 {SITE_CONFIG.country}
              </span>
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3" />
                <a
                  href={SITE_CONFIG.website}
                  className="hover:text-purple-400"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  nova-market-09.vercel.app
                </a>
              </span>
            </div>
          </div>
          <p className="text-center text-xs text-gray-600 mt-4">
            Made with ❤️ in {SITE_CONFIG.country} by {SITE_CONFIG.founder}
          </p>
        </div>
      </div>
    </footer>
  )
}
