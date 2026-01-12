'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useShopStore } from '@/store/shop.store'
import { themeConfig, type ThemeName } from '@/lib/theme-utils'
import { isDevelopment } from '@/lib/env'
import { notFound } from 'next/navigation'

const themes: ThemeName[] = [
  'Классика Dark',
  'Минимализм',
  'Эко / Беж',
  'Океан',
  'Лес',
  'Неон'
]

export default function TestStorePage() {
  // Проверка окружения
  if (!isDevelopment) {
    notFound()
  }

  const {
    shop,
    categories,
    goods,
    brands,
    news,
    theme,
    themeName,
    setThemeByName,
    getCategoryById,
    getGoodById,
    getGoodsByCategory,
    setShop,
  } = useShopStore()

  const [newShopName, setNewShopName] = useState(shop.name)
  const [newShopDomain, setNewShopDomain] = useState(shop.domain)

  // Тест геттеров
  const testCategory = getCategoryById(1)
  const testGood = getGoodById(1)
  const categoryGoods = getGoodsByCategory(1)

  const handleSaveShopInfo = () => {
    setShop({
      ...shop,
      name: newShopName,
      domain: newShopDomain,
    })
    alert('Название магазина обновлено! Обновите страницу чтобы увидеть изменения в шапке.')
  }

  return (
    <div className="p-6 max-w-6xl mx-auto" style={{ backgroundColor: theme.backgroundColor }}>
      <div className="mb-8 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
        <p className="font-bold text-yellow-800">⚠️ ТЕСТОВАЯ СТРАНИЦА</p>
        <p className="text-yellow-700 text-sm">
          Эта страница доступна только в режиме разработки (NODE_ENV=development)
        </p>
      </div>

      <h1 className="text-3xl font-bold mb-8" style={{ color: theme.textColor }}>
        Тест состояния магазина
      </h1>

      {/* Изменение названия магазина */}
      <section className="mb-8 p-6 rounded-xl border" style={{
        backgroundColor: theme.backgroundColor === '#000000' ? '#1a1a1a' : '#f9fafb',
        borderColor: theme.primaryColor,
        color: theme.textColor
      }}>
        <h2 className="text-xl font-semibold mb-4">Название магазина</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Название магазина (отображается в шапке)
            </label>
            <Input
              value={newShopName}
              onChange={(e) => setNewShopName(e.target.value)}
              placeholder="Введите название магазина"
              className="mb-2"
              style={{
                backgroundColor: theme.backgroundColor,
                color: theme.textColor,
                borderColor: theme.primaryColor
              }}
            />
            <p className="text-sm opacity-70">Текущее: <strong>{shop.name}</strong></p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Домен магазина
            </label>
            <Input
              value={newShopDomain}
              onChange={(e) => setNewShopDomain(e.target.value)}
              placeholder="fashion-store"
              className="mb-2"
              style={{
                backgroundColor: theme.backgroundColor,
                color: theme.textColor,
                borderColor: theme.primaryColor
              }}
            />
            <p className="text-sm opacity-70">Текущий: <strong>{shop.domain}</strong></p>
          </div>
        </div>
        <Button
          onClick={handleSaveShopInfo}
          style={{
            backgroundColor: theme.primaryColor,
            color: theme.secondaryColor
          }}
        >
          Сохранить изменения названия
        </Button>
        <p className="text-sm mt-2 opacity-70">
          После сохранения название магазина обновится в шапке и футере
        </p>
      </section>

      {/* Свитчер тем */}
      <section className="mb-8 p-6 rounded-xl border" style={{
        backgroundColor: theme.secondaryColor,
        borderColor: theme.primaryColor
      }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: theme.primaryColor }}>
          Выбор темы магазина
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {themes.map((name) => {
            const themeData = themeConfig[name]
            return (
              <button
                key={name}
                onClick={() => setThemeByName(name)}
                className={`p-4 rounded-lg transition-all ${themeName === name ? 'ring-2 ring-offset-2' : ''}`}
                style={{
                  backgroundColor: themeData.backgroundColor,
                  color: themeData.textColor,
                  border: `1px solid ${themeData.primaryColor}`,
                  ...(themeName === name && {
                    ringColor: themeData.accentColor,
                    transform: 'scale(1.05)',
                  }),
                }}
              >
                <div className="font-medium mb-2">{name}</div>
                <div className="flex gap-1 justify-center">
                  <div className="w-6 h-6 rounded" style={{ backgroundColor: themeData.primaryColor }} />
                  <div className="w-6 h-6 rounded" style={{ backgroundColor: themeData.secondaryColor }} />
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* Информация о магазине */}
      <section className="mb-8 p-6 rounded-xl border" style={{
        backgroundColor: theme.backgroundColor === '#000000' ? '#1a1a1a' : '#f9fafb',
        borderColor: theme.primaryColor,
        color: theme.textColor
      }}>
        <h2 className="text-xl font-semibold mb-4">Информация о магазине</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Название:</strong> {shop.name}</p>
            <p><strong>Домен:</strong> {shop.domain}</p>
            <p><strong>Описание:</strong> {shop.description}</p>
          </div>
          <div>
            <p><strong>Тема:</strong> {themeName}</p>
            <p><strong>Брендов:</strong> {shop.brands.length}</p>
            <p><strong>Категорий:</strong> {shop.categories.length}</p>
          </div>
        </div>
      </section>

      {/* Статистика */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-xl" style={{
          backgroundColor: `${theme.primaryColor}10`,
          border: `1px solid ${theme.primaryColor}`,
          color: theme.textColor
        }}>
          <p className="text-2xl font-bold">{categories.length}</p>
          <p className="text-sm opacity-70">Категорий</p>
        </div>
        <div className="p-4 rounded-xl" style={{
          backgroundColor: `${theme.secondaryColor}10`,
          border: `1px solid ${theme.secondaryColor}`,
          color: theme.textColor
        }}>
          <p className="text-2xl font-bold">{goods.length}</p>
          <p className="text-sm opacity-70">Товаров</p>
        </div>
        <div className="p-4 rounded-xl" style={{
          backgroundColor: `${theme.accentColor}10`,
          border: `1px solid ${theme.accentColor}`,
          color: theme.textColor
        }}>
          <p className="text-2xl font-bold">{brands.length}</p>
          <p className="text-sm opacity-70">Брендов</p>
        </div>
        <div className="p-4 rounded-xl" style={{
          backgroundColor: `${theme.secondaryColor}20`,
          border: `1px solid ${theme.secondaryColor}`,
          color: theme.textColor
        }}>
          <p className="text-2xl font-bold">{news.length}</p>
          <p className="text-sm opacity-70">Новостей</p>
        </div>
      </div>

      {/* Проверка CSS-переменных */}
      <section className="mt-8 p-6 rounded-xl" style={{
        backgroundColor: theme.primaryColor,
        color: theme.secondaryColor
      }}>
        <h2 className="text-xl font-semibold mb-4">CSS-переменные темы</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 rounded" style={{ backgroundColor: 'var(--color-primary)' }}>
            --color-primary
          </div>
          <div className="p-4 rounded" style={{ backgroundColor: 'var(--color-secondary)' }}>
            --color-secondary
          </div>
          <div className="p-4 rounded border" style={{
            color: 'var(--color-text)',
            backgroundColor: 'var(--color-background)'
          }}>
            --color-text
          </div>
        </div>
        <p className="mt-4 text-sm opacity-70">
          Открой DevTools → Elements → проверь :root стили
        </p>
      </section>
    </div>
  )
}