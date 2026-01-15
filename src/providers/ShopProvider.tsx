'use client'

import React, { useEffect, useState } from 'react'
import { useShopStore } from '@/store/shop.store'
import { useAuthStore } from '@/store/auth.store'
import { shopService } from '@/services/shop.service'

interface ShopProviderProps {
  children: React.ReactNode
  shopDomain?: string // Для принудительной установки домена
}

export const ShopProvider: React.FC<ShopProviderProps> = ({
  children,
  shopDomain
}) => {
  const {
    shop,
    loadShop,
    loadCategories,
    loadProducts,
    loadBrands,
    loadNews,
    isLoading,
    error
  } = useShopStore()

  const { isAuthenticated } = useAuthStore()
  const [initialized, setInitialized] = useState(false)

  // Загрузка данных магазина при монтировании
  useEffect(() => {
    const initShop = async () => {
      try {
        // Определяем домен магазина
        let domain = shopService.getShopDomainFromUrl() || shopDomain || 'default'

        // Авто-выбор магазина на localhost при первом заходе (нет cookie и query)
        if (typeof window !== 'undefined') {
          const hostname = window.location.hostname
          const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1'

          if (isLocalhost && domain === 'default') {
            const shops = await shopService.getAllShops()
            const active = shops
              .filter((s: any) => s && (s.isActive !== false))
              .sort((a: any, b: any) => {
                const aTime = new Date(a.createdAt || 0).getTime()
                const bTime = new Date(b.createdAt || 0).getTime()
                return bTime - aTime
              })

            const picked = active[0]
            const pickedDomain = picked?.domain || picked?.url
            if (pickedDomain) {
              document.cookie = `shop=${encodeURIComponent(pickedDomain)}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`
              domain = pickedDomain
            }
          }
        }
        console.log('Initializing shop with domain:', domain)

        // Загружаем магазин
        await loadShop(domain)

        setInitialized(true)
      } catch (error) {
        console.error('Error initializing shop:', error)
        setInitialized(true)
      }
    }

    if (!initialized) {
      initShop()
    }
  }, [initialized, loadShop, shopDomain])

  // Обновление данных магазина при изменении авторизации
  useEffect(() => {
    if (shop && initialized) {
      const refreshData = async () => {
        try {
          const shopId = shop.id.toString()

          // Загружаем актуальные данные в зависимости от авторизации
          if (isAuthenticated) {
            // Для авторизованных пользователей загружаем всё
            await Promise.all([
              loadCategories(shopId),
              loadProducts(shopId),
              loadBrands(shopId),
              loadNews(shopId)
            ])
          } else {
            // Для неавторизованных только основные данные
            await Promise.all([
              loadCategories(shopId),
              loadProducts(shopId),
              loadBrands(shopId)
            ])
          }
        } catch (error) {
          console.error('Error refreshing shop data:', error)
        }
      }

      refreshData()
    }
  }, [shop, isAuthenticated, initialized, loadCategories, loadProducts, loadBrands, loadNews])

  // Обработка изменения домена в реальном времени
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleDomainChange = () => {
      const currentDomain = shopService.getShopDomainFromUrl()
      const shopDomainStr = shop?.domain || ''

      if (shopDomainStr && currentDomain !== shopDomainStr) {
        console.log('Domain changed, reloading shop...')
        loadShop(currentDomain)
      }
    }

    // Слушаем изменения URL (например, переход между магазинами)
    window.addEventListener('popstate', handleDomainChange)

    // Можно также слушать изменения в query параметрах
    const observer = new MutationObserver(handleDomainChange)
    observer.observe(document, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('popstate', handleDomainChange)
      observer.disconnect()
    }
  }, [shop?.domain, loadShop])

  // Встраиваем тему магазина в стили
  useEffect(() => {
    if (shop && typeof window !== 'undefined') {
      const style = document.createElement('style')
      style.textContent = `
        :root {
          --shop-primary-color: ${shop.primaryColor || '#3b82f6'};
          --shop-secondary-color: ${shop.secondaryColor || '#1e40af'};
          --shop-background-color: ${shop.backgroundColor || '#f9fafb'};
          --shop-text-color: ${shop.textColor || '#111827'};
          --shop-accent-color: ${shop.accentColor || '#10b981'};
        }

        .shop-theme-primary {
          color: var(--shop-primary-color);
        }

        .shop-theme-bg-primary {
          background-color: var(--shop-primary-color);
        }

        .shop-theme-border-primary {
          border-color: var(--shop-primary-color);
        }
      `
      document.head.appendChild(style)

      return () => {
        document.head.removeChild(style)
      }
    }
  }, [shop])

  // Показываем loading состояние
  if (isLoading && !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Загружаем магазин...</p>
        </div>
      </div>
    )
  }

  // Показываем ошибку
  if (error && !shop) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Ошибка загрузки магазина</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => {
              const domain = shopDomain || shopService.getShopDomainFromUrl()
              loadShop(domain)
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    )
  }

  // Показываем fallback если магазин не найден
  if (!shop && initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="text-gray-400 text-5xl mb-4">🏪</div>
          <h2 className="text-xl font-semibold mb-2">Магазин не найден</h2>
          <p className="text-gray-600 mb-4">
            Магазин с таким адресом не существует или временно недоступен.
          </p>
          <a
            href="/"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 inline-block"
          >
            На главную
          </a>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
