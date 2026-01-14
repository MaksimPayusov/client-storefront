'use client';

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ProductCard from '@/components/shared/ProductCard'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useShopStore } from '@/store/shop.store'
import { getSafeImageUrl } from '@/lib/utils'

export default function HomePage() {
  const {
    goods,
    categories,
    news,
    getCategoryTree
  } = useShopStore()

  // Получаем корневые категории
  const rootCategories = getCategoryTree().filter(cat => cat.parentId === null)

  // Товары (первые 8 из всех товаров)
  const featuredProducts = goods.slice(0, 8)

  // Последние новости
  const latestNews = news.slice(0, 3)

  return (
    <>
      {/* Популярные категории */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Категории</h2>
          <Link href="/catalog" className="text-black hover:underline font-medium">
            Все категории →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {rootCategories.slice(0, 4).map((category) => (
            <Link
              key={category.id}
              href={`/catalog/${category.id}`}
              className="group relative overflow-hidden rounded-xl bg-gray-100 aspect-square"
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                <h3 className="text-lg font-semibold text-center">{category.name}</h3>
                <p className="text-sm text-gray-600 mt-2 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {category.description}
                </p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </section>

      {/* Товары */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Товары</h2>
          <Link href="/catalog" className="text-black hover:underline font-medium">
            Все товары →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </section>

      {/* Новости */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Новости</h2>
            <p className="text-gray-600">Самые свежие обновления из мира моды</p>
          </div>
          <Link
            href="/news"
            className="text-black hover:underline font-medium flex items-center gap-2"
          >
            Все новости
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {latestNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestNews.map((newsItem) => (
              <Link
                key={newsItem.id}
                href={`/news/${newsItem.id}`}
                className="group"
              >
                <article className="bg-white rounded-2xl border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-48 overflow-hidden">
                    {newsItem.image ? (
                      <Image
                        src={getSafeImageUrl(newsItem.image)}
                        alt={newsItem.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                        <div className="w-12 h-12 text-gray-400">📰</div>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {newsItem.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {newsItem.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-primary font-medium group-hover:gap-2 transition-all">
                        Читать
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <div className="w-12 h-12 mx-auto mb-4 text-gray-400">📰</div>
            <p className="text-gray-600">Скоро здесь появятся новости</p>
          </div>
        )}
      </section>
    </>
  )
}
