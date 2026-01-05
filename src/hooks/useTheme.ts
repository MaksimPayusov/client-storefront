// Хук для получения и применения темы магазина

'use client'

import { useShopStore } from '@/store/shop.store'
import { getThemeVariables, getThemeByName, type ThemeName } from '@/lib/theme-utils'

export function useTheme() {
  const theme = useShopStore((state) => state.theme)
  const themeName = useShopStore((state) => state.themeName)
  const setTheme = useShopStore((state) => state.setTheme)
  const setThemeByName = useShopStore((state) => state.setThemeByName)

  return {
    theme,
    themeName,
    setTheme,
    setThemeByName,

    // CSS-переменные для inline-стилей
    cssVariables: getThemeVariables(theme),

    // Утилитарные функции
    getColor: (color: keyof typeof theme) => theme[color],

    // Готовые стили для часто используемых элементов
    styles: {
      primaryButton: {
        backgroundColor: theme.buttonBg,
        color: theme.buttonText,
      },
      secondaryButton: {
        backgroundColor: theme.secondaryColor,
        color: theme.primaryColor,
      },
      gradientBg: {
        background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
      },
      border: {
        borderColor: theme.primaryColor,
      },
      text: {
        color: theme.textColor,
      },
      accentBorder: {
        borderColor: theme.accentColor,
      },
      accentText: {
        color: theme.accentColor,
      },
    },
  }
}