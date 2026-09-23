import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AIAssistant from '@/components/AIAssistant'
import ActivityTracker from '@/components/ActivityTracker'
import SellerAIAssistant from '@/components/SellerAIAssistant'
import IntroAnimation from '@/components/intro/IntroAnimation'
import { CartProvider } from '@/lib/cart-context'
import RecaptchaProvider from '@/components/RecaptchaProvider'
import { ThemeProvider } from '@/lib/theme-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NovaMarket — Buy & Sell Anything',
  description: 'The smarter marketplace with AI-powered search',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 dark:bg-slate-900 min-h-screen flex flex-col`}>
        <ThemeProvider>
          <IntroAnimation />
          <RecaptchaProvider>
            <CartProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <AIAssistant />
              <ActivityTracker />
              <SellerAIAssistant />
            </CartProvider>
          </RecaptchaProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



