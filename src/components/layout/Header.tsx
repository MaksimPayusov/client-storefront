'use client';

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ShoppingCart, User, Menu, X, Sparkles, Heart } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { useFavoritesStore } from '@/store/favorites.store'
import { useCartStore } from '@/store/cart.store'
import { useShopStore } from '@/store/shop.store'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, themeName } = useTheme()

  // Добавить получение количества избранного
  const { items } = useFavoritesStore()
  const favoritesCount = items.length

  // Получаем название магазина из store
  const shopName = useShopStore((state) => state.shop.name)

  const navLinks = [
    { href: '/', label: 'Главная' },
    { href: '/catalog', label: 'Каталог' },
    { href: '/brands', label: 'Бренды' },
    { href: '/news', label: 'Новости' },
    { href: '/about', label: 'О нас' },
    // Тестовая ссылка
    ...(process.env.NODE_ENV === 'development'
      ? [{ href: '/test-store', label: 'Тест', featured: false }]
      : []),
  ];

  const { totalQuantity } = useCartStore()

  // Функция для определения цвета фона шапки с учетом темы
  const getHeaderBackgroundColor = () => {
    if (themeName === 'Классика Dark') {
      return theme.backgroundColor; // #000000
    } else if (themeName === 'Минимализм') {
      return theme.backgroundColor; // #ffffff
    }
    // Для остальных тем используем полупрозрачную версию фона
    return `${theme.backgroundColor}E6`; // 90% opacity
  };

  // Функция для определения цвета текста в шапке
  const getHeaderTextColor = () => {
    if (themeName === 'Классика Dark') {
      return theme.secondaryColor; // white для черного фона
    } else if (themeName === 'Минимализм') {
      return theme.secondaryColor; // black для белого фона
    }
    // Для остальных тем используем textColor из темы
    return theme.textColor;
  };

  // Функция для определения цвета текста навигации
  const getNavTextColor = () => {
    if (themeName === 'Классика Dark') {
      return `${theme.secondaryColor}CC`; // white with 80% opacity
    } else if (themeName === 'Минимализм') {
      return `${theme.secondaryColor}CC`; // black with 80% opacity
    }
    // Для остальных тем используем textColor с небольшой прозрачностью
    return `${theme.textColor}CC`;
  };

  // Функция для определения цвета кнопок в шапке
  const getButtonTextColor = () => {
    if (themeName === 'Классика Dark') {
      return theme.secondaryColor; // white
    } else if (themeName === 'Минимализм') {
      return theme.secondaryColor; // black
    }
    // Для остальных тем используем textColor
    return theme.textColor;
  };

  const headerBgColor = getHeaderBackgroundColor();
  const headerTextColor = getHeaderTextColor();
  const navTextColor = getNavTextColor();
  const buttonTextColor = getButtonTextColor();

  return (
    <header
      className="sticky top-0 z-50 w-full border-b backdrop-blur-md shadow-sm"
      style={{
        backgroundColor: headerBgColor,
        borderBottomColor: `${theme.primaryColor}20`
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Логотип */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* Иконка */}
            <Sparkles
              className="w-6 h-6"
              style={{ color: headerTextColor }}
            />

            {/* Название магазина */}
            <span
              className="text-xl font-bold"
              style={{ color: headerTextColor }}
            >
              {shopName || 'Fashion Store'}
            </span>
          </Link>

          {/* Навигация (десктоп) */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-100"
                style={{
                  color: navTextColor,
                  opacity: 0.8
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Иконки действий */}
          <div className="flex items-center gap-3">
            <Link href="/account">
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex gap-2"
                style={{ color: buttonTextColor }}
              >
                <User className="w-4 h-4" />
                <span>Кабинет</span>
              </Button>
            </Link>

            {/* Избранное */}
            <Link href="/favorites">
              <Button
                variant="ghost"
                size="sm"
                className="relative"
                style={{ color: theme.accentColor }}
              >
                <Heart className="w-4 h-4" />
                {favoritesCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-sm"
                    style={{ backgroundColor: theme.accentColor }}
                  >
                    {favoritesCount > 9 ? '9+' : favoritesCount}
                  </span>
                )}
              </Button>
            </Link>

            <Link href="/cart">
              <Button
                variant="ghost"
                size="sm"
                className="relative"
                style={{ color: theme.accentColor }}
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="ml-2 hidden md:inline">Корзина</span>
                {totalQuantity > 0 && (
                  <span
                    className="absolute -top-1 -right-1 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-sm"
                    style={{ backgroundColor: theme.accentColor }}
                  >
                    {totalQuantity > 9 ? '9+' : totalQuantity}
                  </span>
                )}
              </Button>
            </Link>

            {/* Мобильное меню */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{ color: buttonTextColor }}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Мобильное меню */}
        {isMenuOpen && (
          <div
            className="md:hidden py-4 border-t animate-in slide-up"
            style={{
              borderTopColor: `${theme.primaryColor}20`,
              backgroundColor: theme.backgroundColor
            }}
          >
            <div className="space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-3 rounded-lg text-sm font-medium transition-all"
                  style={{
                    color: headerTextColor,
                    backgroundColor: theme.backgroundColor === '#000000' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Добавить в мобильное меню */}
              <Link
                href="/favorites"
                className="block px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2"
                style={{
                  color: headerTextColor,
                  backgroundColor: theme.backgroundColor === '#000000' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart className="w-4 h-4" />
                Избранное {favoritesCount > 0 && `(${favoritesCount})`}
              </Link>

              <div className="pt-3 border-t" style={{ borderTopColor: `${theme.primaryColor}20` }}>
                <div className="mt-3 px-4">
                  <Button
                    variant="ghost"
                    fullWidth
                    className="justify-start"
                    style={{ color: buttonTextColor }}
                  >
                    <User className="w-4 h-4 mr-3" />
                    Войти в аккаунт
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header