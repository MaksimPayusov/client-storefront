import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { cookies } from 'next/headers'
import './globals.css'
import { Layout } from '@/components/layout/Layout'
import { ShopProvider } from '@/providers/ShopProvider'
import { AuthProvider } from '@/providers/AuthProvider'
import { AuthDebug } from '@/components/debug/AuthDebug'
import { isDebugMode } from '@/lib/env'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'Fashion Store — Интернет-магазин одежды',
  description: 'Лучший выбор одежды по лучшим ценам',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const cookieShop = cookieStore.get('shop')?.value
  const shopDomain = cookieShop || process.env.NEXT_PUBLIC_SHOP_DOMAIN || 'default'

  return (
    <html lang="ru" className="scroll-smooth">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <ShopProvider shopDomain={shopDomain}>
          <AuthProvider>
            <Layout>{children}</Layout>
            {isDebugMode && <AuthDebug />}
          </AuthProvider>
        </ShopProvider>
      </body>
    </html>
  )
}
