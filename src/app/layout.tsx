import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Layout } from '@/components/layout/Layout'
import { ShopProvider } from '@/providers/ShopProvider'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'Fashion Store — Интернет-магазин одежды',
  description: 'Лучший выбор одежды по лучшим ценам',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // В будущем shopDomain можно брать из URL или конфига
  const shopDomain = process.env.NEXT_PUBLIC_SHOP_DOMAIN || 'fashion-store'

  return (
    <html lang="ru" className="scroll-smooth">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <ShopProvider shopDomain={shopDomain}>
          <Layout>{children}</Layout>
        </ShopProvider>
      </body>
    </html>
  )
}
