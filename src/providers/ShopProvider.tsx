// провайдер для магазина

'use client'

import React, { useEffect } from 'react'
import { useShopStore } from '@/store/shop.store'

// Этот компонент можно использовать для инициализации данных магазина
// когда появится API (например, загрузка по domain)
interface ShopProviderProps {
  children: React.ReactNode
  shopDomain?: string // Для будущей загрузки магазина по домену
}

export const ShopProvider: React.FC<ShopProviderProps> = ({
  children,
  shopDomain
}) => {
  const { setShop, setCategories, setGoods, setBrands, setNews } = useShopStore()

  // Здесь будет загрузка данных магазина по API
  // Пока используем моки из store
  useEffect(() => {
    if (shopDomain) {
      // В будущем: fetch(`/api/shops/${shopDomain}`)
      console.log('Загружаем магазин по домену:', shopDomain)
      // Пока ничего не делаем, т.к. данные уже в сторе
    }
  }, [shopDomain])

  // Пока ничего не возвращаем, только оборачиваем children
  // В будущем можно добавить loading состояния
  return <>{children}</>
}