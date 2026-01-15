'use client'

import React, { useEffect, useState } from 'react'
import { notFound, useParams } from 'next/navigation'
import Image from 'next/image'
import ProductCard from '@/components/shared/ProductCard'
import ProductInteractivePart from './ProductInteractivePart'
import { useShopStore } from '@/store/shop.store'
import { Truck, Shield, RefreshCw } from 'lucide-react'
import { shopService } from '@/services/shop.service'

export default function ProductClientPage() {
  const [mounted, setMounted] = useState(false)

  const params = useParams()
  const productId = params.productId as string

  const { getGoodById, goods, loadShop, isLoading } = useShopStore()
  const product = getGoodById(productId)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    if (product) return
    if (isLoading) return

    const domain = shopService.getShopDomainFromUrl()
    loadShop(domain)
  }, [mounted, product, isLoading, loadShop])

  // На SSR и до монтирования не роняем страницу в 404,
  // чтобы не получать серверный 404 из-за пустого zustand-store.
  if (!mounted) {
    return (
      <div className="py-16 text-center text-gray-600">
        Загружаем товар...
      </div>
    )
  }

  if (!product) {
    if (isLoading) {
      return (
        <div className="py-16 text-center text-gray-600">
          Загружаем товар...
        </div>
      )
    }

    notFound()
  }

  // Похожие товары (той же категории, исключая текущий)
  const relatedProducts = goods
    .filter(p => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4)

  return (
    <div>
      {/* Хлебные крошки */}
      <div className="text-sm text-gray-600 mb-6">
        <span>Главная</span> / <span>Каталог</span> / <span className="text-black">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Галерея изображений */}
        <div>
          <div className="aspect-square relative rounded-xl overflow-hidden bg-gray-100 mb-4">
            <Image
              src={product.image || '/images/placeholder.svg'}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, idx) => (
                <div
                  key={idx}
                  className="w-20 h-20 flex-shrink-0 rounded border border-gray-300"
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Информация о товаре */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="text-2xl font-bold">{product.price.toLocaleString()} ₽</div>
          </div>

          <div className="mb-8">
            <h3 className="font-medium mb-2">Описание</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>

          <ProductInteractivePart product={product} />

          {/* Информация о доставке */}
          <div className="bg-gray-50 rounded-xl p-6 space-y-4 mt-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Truck className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <div className="font-medium">Бесплатная доставка</div>
                <div className="text-sm text-gray-600">При заказе от 5 000 ₽</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <div className="font-medium">Гарантия возврата</div>
                <div className="text-sm text-gray-600">14 дней на возврат</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <RefreshCw className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <div className="font-medium">Обмен размера</div>
                <div className="text-sm text-gray-600">В течение 7 дней</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Похожие товары */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Похожие товары</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
