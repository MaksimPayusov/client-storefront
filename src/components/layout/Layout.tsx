'use client'

import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { ThemeInitializer } from '@/components/theme/ThemeInitializer'
import ThemeSwitcher from '@/components/theme/ThemeSwitcher'
import { useShopStore } from '@/store/shop.store'
import { CartMini } from '@/components/cart/CartMini'
import { isDebugMode } from '@/lib/env'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const shop = useShopStore((state) => state.shop)

  return (
    <div className="min-h-screen flex flex-col">
      <ThemeInitializer />

      {/* Свитчер тем - только в режиме разработки */}
      {isDebugMode && <ThemeSwitcher />}

      <Header />

      <main className="flex-1 container mx-auto px-4 py-6 md:px-6 lg:px-8">
        {/* Debug info - только в режиме разработки */}
        {isDebugMode && (
          <div className="fixed bottom-20 right-4 z-50 bg-black/80 text-white text-xs p-2 rounded-lg opacity-70">
            Тема: {shop.theme || 'стандартная'}
          </div>
        )}

        {children}
        <CartMini />
      </main>

      <Footer />
    </div>
  )
}