'use client';

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ShoppingCart, User, Menu, X, Sparkles, Heart, LogOut } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { useFavoritesStore } from '@/store/favorites.store'
import { useCartStore } from '@/store/cart.store'
import { useShopStore } from '@/store/shop.store'
import { useAuthStore } from '@/store/auth.store'
import { cn } from '@/lib/utils'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { theme, themeName } = useTheme()
  const { user, isAuthenticated, logout } = useAuthStore()

  // Получаем количество избранного
  const { items } = useFavoritesStore()
  const favoritesCount = items.length

  // Получаем название магазина
  const shopName = useShopStore((state) => state.shop?.name || 'Fashion Store')

  const navLinks = [
    { href: '/', label: 'Главная' },
    { href: '/catalog', label: 'Каталог' },
    { href: '/brands', label: 'Бренды' },
    { href: '/news', label: 'Новости' },
    { href: '/about', label: 'О нас' },
    { href: '/yandex-delivery-test', label: 'Тест доставки' },
  ];

  const { totalQuantity } = useCartStore()

  // Функция для определения цвета
  const getHeaderBackgroundColor = () => {
    if (themeName === 'Классика Dark') {
      return theme.backgroundColor;
    } else if (themeName === 'Минимализм') {
      return theme.backgroundColor;
    }
    return `${theme.backgroundColor}E6`;
  };

  const getHeaderTextColor = () => {
    if (themeName === 'Классика Dark') {
      return theme.secondaryColor;
    } else if (themeName === 'Минимализм') {
      return theme.secondaryColor;
    }
    return theme.textColor;
  };

  const getNavTextColor = () => {
    if (themeName === 'Классика Dark') {
      return `${theme.secondaryColor}CC`;
    } else if (themeName === 'Минимализм') {
      return `${theme.secondaryColor}CC`;
    }
    return `${theme.textColor}CC`;
  };

  const getButtonTextColor = () => {
    if (themeName === 'Классика Dark') {
      return theme.secondaryColor;
    } else if (themeName === 'Минимализм') {
      return theme.secondaryColor;
    }
    return theme.textColor;
  };

  const headerBgColor = getHeaderBackgroundColor();
  const headerTextColor = getHeaderTextColor();
  const navTextColor = getNavTextColor();
  const buttonTextColor = getButtonTextColor();

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
  }

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
            <Sparkles
              className="w-6 h-6"
              style={{ color: headerTextColor }}
            />
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
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-opacity-20 transition-colors"
                  style={{
                    color: buttonTextColor,
                    backgroundColor: theme.backgroundColor === '#000000' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <User className="w-4 h-4" />
                  <span className="max-w-[120px] truncate">
                    {user?.firstName || 'Пользователь'}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-48 rounded-xl border shadow-xl animate-in slide-in-from-top-2 z-50"
                    style={{
                      backgroundColor: theme.backgroundColor,
                      borderColor: `${theme.primaryColor}20`,
                      color: theme.textColor
                    }}
                  >
                    <div className="p-3 border-b" style={{ borderColor: `${theme.primaryColor}20` }}>
                      <div className="font-medium truncate">{user?.email}</div>
                      <div className="text-sm opacity-70 truncate">
                        {user?.firstName} {user?.lastName}
                      </div>
                    </div>

                    <div className="p-1">
                      <Link
                        href="/account"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-opacity-20 transition-colors block"
                        style={{
                          color: theme.textColor,
                          backgroundColor: theme.backgroundColor === '#000000' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
                        }}
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        Личный кабинет
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-500/20 hover:text-red-500 transition-colors w-full text-left"
                        style={{ color: theme.textColor }}
                      >
                        <LogOut className="w-4 h-4" />
                        Выйти
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden md:flex gap-2"
                  style={{ color: buttonTextColor }}
                >
                  <User className="w-4 h-4" />
                  <span>Войти</span>
                </Button>
              </Link>
            )}

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

            {/* Корзина */}
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

              {/* Избранное в мобильном меню */}
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

              {/* Авторизация в мобильном меню */}
              <div className="pt-3 border-t" style={{ borderTopColor: `${theme.primaryColor}20` }}>
                {isAuthenticated ? (
                  <>
                    <div className="px-4 mb-3">
                      <div className="font-medium truncate">{user?.email}</div>
                      <div className="text-sm opacity-70 truncate">
                        {user?.firstName} {user?.lastName}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Link
                        href="/account"
                        className="block px-4 py-3 rounded-lg text-sm font-medium"
                        style={{
                          color: headerTextColor,
                          backgroundColor: theme.backgroundColor === '#000000' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
                        }}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Личный кабинет
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-red-500"
                        style={{
                          backgroundColor: theme.backgroundColor === '#000000' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
                        }}
                      >
                        Выйти
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="mt-3 px-4 space-y-2">
                    <Link
                      href="/auth/login"
                      className="block"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        fullWidth
                        className="justify-start"
                        style={{ color: buttonTextColor }}
                      >
                        <User className="w-4 h-4 mr-3" />
                        Войти
                      </Button>
                    </Link>
                    <Link
                      href="/auth/register"
                      className="block"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Button
                        variant="outline"
                        fullWidth
                        style={{
                          backgroundColor: theme.primaryColor,
                          color: theme.secondaryColor,
                          borderColor: theme.primaryColor
                        }}
                      >
                        Зарегистрироваться
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
