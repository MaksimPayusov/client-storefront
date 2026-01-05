'use client';

import React, { useState, useMemo } from 'react'
import ProductCard from '@/components/shared/ProductCard'
import CategoryTree from '@/components/catalog/CategoryTree'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Filter, ChevronDown, X, Building2 } from 'lucide-react'
import { useShopStore } from '@/store/shop.store'
import { cn } from '@/lib/utils'
import { useTheme } from '@/hooks/useTheme'
import Link from 'next/link'

export default function CatalogPage() {
  const {
    goods,
    brands,
    getCategoryTree,
    getChildCategories,
    getGoodsByCategory
  } = useShopStore()
  const { theme } = useTheme()

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 20000])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc'>('default')

  // Получаем активную категорию и её подкатегории
  const activeCategory = selectedCategory
    ? getCategoryTree().find(cat => cat.id === selectedCategory)
    : null

  // Бренды из хранилища, у которых есть товары
  const availableBrands = useMemo(() => {
    return brands.filter(brand =>
      goods.some(product => product.brand === brand.name)
    )
  }, [brands, goods])

  // Фильтрация товаров
  const filteredGoods = useMemo(() => {
    let filtered = [...goods]

    // Фильтр по категории
    if (selectedCategory) {
      filtered = getGoodsByCategory(selectedCategory, true)
    }

    // Фильтр по брендам (используем ID брендов)
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(product =>
        product.brand && selectedBrands.includes(product.brand)
      )
    }

    // Фильтр по цене
    filtered = filtered.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    )

    // Фильтр по поиску
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query)
      )
    }

    // Сортировка
    if (sortBy === 'price_asc') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price_desc') {
      filtered.sort((a, b) => b.price - a.price)
    }

    return filtered
  }, [goods, selectedCategory, selectedBrands, priceRange, searchQuery, sortBy, getGoodsByCategory])

  // Обработчики
  const toggleBrand = (brandName: string) => {
    setSelectedBrands(prev =>
      prev.includes(brandName)
        ? prev.filter(b => b !== brandName)
        : [...prev, brandName]
    )
  }

  const clearFilters = () => {
    setSelectedCategory(null)
    setSelectedBrands([])
    setPriceRange([0, 20000])
    setSearchQuery('')
    setSortBy('default')
  }

  return (
    <div>
      {/* Заголовок и поиск */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Каталог товаров</h1>
          {activeCategory && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              <X className="w-4 h-4 mr-2" />
              Очистить категорию
            </Button>
          )}
        </div>

        {activeCategory && (
          <div className="mb-6 p-4 rounded-xl" style={{
            backgroundColor: `${theme.primaryColor}08`,
            borderLeft: `4px solid ${theme.primaryColor}`
          }}>
            <h2 className="text-xl font-semibold mb-2">{activeCategory.title}</h2>
            {activeCategory.description && (
              <p className="text-gray-600">{activeCategory.description}</p>
            )}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Поиск по названию, описанию или бренду..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Сайдбар фильтров */}
        <aside className="lg:w-80 flex-shrink-0 space-y-6">
          <CategoryTree
            activeCategoryId={selectedCategory || undefined}
            collapsible={true}
            className="sticky top-24"
          />

          <div className="bg-white rounded-xl border p-6 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Фильтры
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-sm"
                onClick={clearFilters}
              >
                Сбросить все
              </Button>
            </div>

            {/* Бренды */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Бренды</h4>
                <Link
                  href="/brands"
                  className="text-xs text-gray-500 hover:text-black transition-colors"
                >
                  Все бренды →
                </Link>
              </div>

              {availableBrands.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {availableBrands.map(brand => (
                    <label key={brand.id} className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand.name)}
                        onChange={() => toggleBrand(brand.name)}
                        className="mr-2 rounded border-gray-300"
                      />
                      <div className="flex items-center gap-2 flex-1">
                        {brand.logo ? (
                          <img
                            src={brand.logo}
                            alt={brand.name}
                            className="w-6 h-6 object-contain rounded"
                          />
                        ) : (
                          <Building2 className="w-5 h-5 text-gray-400" />
                        )}
                        <span className="text-sm group-hover:text-primary transition-colors">
                          {brand.name}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Нет доступных брендов</p>
              )}
            </div>

            {/* Цена */}
            <div>
              <h4 className="font-medium mb-3">Цена, ₽</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Input
                    type="number"
                    placeholder="0"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                    className="text-center"
                  />
                  <span className="text-gray-500">—</span>
                  <Input
                    type="number"
                    placeholder="20000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                    className="text-center"
                  />
                </div>
                <div className="text-xs text-gray-500 text-center">
                  От {priceRange[0].toLocaleString()} до {priceRange[1].toLocaleString()} ₽
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Основной контент */}
        <div className="flex-1">
          {/* Панель сортировки и статистики */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="text-gray-600">
              Найдено {filteredGoods.length} товаров
              {selectedCategory && ` в категории "${activeCategory?.title}"`}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Сортировка:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="default">По умолчанию</option>
                <option value="price_asc">Сначала дешевые</option>
                <option value="price_desc">Сначала дорогие</option>
              </select>
            </div>
          </div>

          {/* Подкатегории активной категории */}
          {selectedCategory && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Подкатегории</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {getChildCategories(selectedCategory).map(child => (
                  <button
                    key={child.id}
                    onClick={() => setSelectedCategory(child.id)}
                    className="p-4 text-left rounded-xl border hover:border-gray-400 transition-colors"
                  >
                    <div className="font-medium">{child.title}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {getGoodsByCategory(child.id, true).length} товаров
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Товары */}
          {filteredGoods.length > 0 ? (
            <div className={'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'}>
              {filteredGoods.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  className={''}
                  showDescription={false}
                  onAddToCart={() => alert(`Товар "${product.name}" добавлен в корзину`)}
                />
              ))}
            </div>
          ) : (
            /* Если товары не найдены */
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <div className="text-5xl mb-4">😔</div>
              <h3 className="text-xl font-bold mb-2">Товары не найдены</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Попробуйте изменить параметры поиска или выбрать другую категорию
              </p>
              <Button onClick={clearFilters} variant="theme-primary">
                Сбросить фильтры
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}