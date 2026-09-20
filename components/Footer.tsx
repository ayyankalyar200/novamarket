import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold text-purple-400 mb-4">NovaMarket</h3>
            <p className="text-gray-400 text-sm">
              The smarter marketplace with AI-powered search. Buy and sell anything, anywhere.
            </p>
          </div>

          {/* Buy */}
          <div>
            <h4 className="font-semibold mb-4">Buy</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/products" className="hover:text-purple-400">All Products</Link></li>
              <li><Link href="/wishlist" className="hover:text-purple-400">Wishlist</Link></li>
              <li><Link href="/orders" className="hover:text-purple-400">My Orders</Link></li>
              <li><Link href="/cart" className="hover:text-purple-400">Cart</Link></li>
            </ul>
          </div>

          {/* Sell */}
          <div>
            <h4 className="font-semibold mb-4">Sell</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/sell" className="hover:text-purple-400">Start Selling</Link></li>
              <li><Link href="/dashboard/seller" className="hover:text-purple-400">Seller Dashboard</Link></li>
              <li><Link href="/dashboard/seller" className="hover:text-purple-400">Seller Dashboard</Link></li>
              <li><Link href="/pricing" className="hover:text-purple-400">Pricing</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/help" className="hover:text-purple-400">Help Center</Link></li>
              <li><Link href="/returns" className="hover:text-purple-400">Returns</Link></li>
              <li><Link href="/buyer-protection" className="hover:text-purple-400">Buyer Protection</Link></li>
              <li><Link href="/contact" className="hover:text-purple-400">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>Â© 2026 NovaMarket. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
