// компонент для инициализации темы

'use client'

import { useEffect } from 'react'
import { useShopStore } from '@/store/shop.store'
import { applyThemeToDocument } from '@/lib/theme-utils'

/*
 * Компонент для применения темы магазина к документу
 * Рендерится один раз на клиенте
 */
export function ThemeInitializer() {
  const theme = useShopStore((state) => state.theme)

  useEffect(() => {
    // Применяем тему к документу
    applyThemeToDocument(theme)

    // Также можно добавить класс к body для конкретной темы
    document.body.classList.add('theme-loaded')

    return () => {
      document.body.classList.remove('theme-loaded')
    }
  }, [theme])

  // Этот компонент ничего не рендерит
  return null
}