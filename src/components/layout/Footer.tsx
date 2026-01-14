'use client'

import React from 'react'
import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { useShopStore } from '@/store/shop.store'

const Footer = () => {
  const { theme, themeName } = useTheme()
  const shopName = useShopStore((state) => state.shop?.name || 'Магазин')

  const footerLinks = {
    Магазин: [
      { label: 'Каталог', href: '/catalog' },
      { label: 'Бренды', href: '/brands' },
      { label: 'Новости', href: '/news' },
    ],
    Помощь: [
      { label: 'О нас', href: '/about' },
    ],
  }

  // Функция для определения контрастного цвета текста в футере
  const getFooterTextColor = () => {
    if (themeName === 'Классика Dark') {
      return theme.secondaryColor; // white
    } else if (themeName === 'Минимализм') {
      return theme.secondaryColor; // black
    }
    return theme.textColor;
  };

  // Функция для определения цвета заголовков в футере
  const getFooterHeadingColor = () => {
    if (themeName === 'Классика Dark') {
      return theme.secondaryColor; // white
    } else if (themeName === 'Минимализм') {
      return theme.secondaryColor; // black
    }
    return theme.textColor;
  };

  // Функция для определения цвета ссылок в футере
  const getFooterLinkColor = () => {
    if (themeName === 'Классика Dark') {
      return `${theme.secondaryColor}80`; // white with 50% opacity
    } else if (themeName === 'Минимализм') {
      return `${theme.secondaryColor}80`; // black with 50% opacity
    }
    return `${theme.textColor}70`;
  };

  const footerTextColor = getFooterTextColor();
  const footerHeadingColor = getFooterHeadingColor();
  const footerLinkColor = getFooterLinkColor();

  return (
    <footer
      className="mt-16"
      style={{
        backgroundColor: theme.backgroundColor,
        borderTop: `1px solid ${theme.primaryColor}20`
      }}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Лого и описание */}
          <div>
            <h2
              className="text-2xl font-bold mb-4"
              style={{ color: footerHeadingColor }}
            >
              {shopName || 'Магазин'}
            </h2>
            <p
              className="mb-6"
              style={{ color: footerLinkColor }}
            >
              Лучший выбор одежды для любого случая. Качество, стиль и доступные цены.
            </p>
          </div>

          {/* Ссылки */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: footerHeadingColor }}
              >
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="hover:opacity-100 transition-opacity"
                      style={{
                        color: footerLinkColor,
                        opacity: 0.8
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Контакты */}
          <div>
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: footerHeadingColor }}
            >
              Контакты
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3" style={{ color: footerLinkColor }}>
                <Phone className="w-5 h-5" />
                <span>+7 (999) 123-45-67</span>
              </li>
              <li className="flex items-center gap-3" style={{ color: footerLinkColor }}>
                <Mail className="w-5 h-5" />
                <span>support@fashionstore.ru</span>
              </li>
              <li className="flex items-start gap-3" style={{ color: footerLinkColor }}>
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>г. Екатеринбург, ул. Мира, 32</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Нижняя часть */}
        <div
          className="border-t mt-8 pt-8 text-center text-sm"
          style={{
            borderColor: `${theme.primaryColor}20`,
            color: footerLinkColor
          }}
        >
          <p>© 2025-2026 {shopName || 'Магазин'}. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
