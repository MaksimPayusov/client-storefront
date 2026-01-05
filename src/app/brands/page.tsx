'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Building2, Globe, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useShopStore } from '@/store/shop.store';
import { getSafeImageUrl } from '@/lib/utils';

export default function BrandsPage() {
  const { brands, goods } = useShopStore();

  // Для каждого бренда считаем количество товаров
  const brandsWithStats = brands.map(brand => {
    const brandGoods = goods.filter(product => product.brand === brand.name);
    return {
      ...brand,
      productCount: brandGoods.length,
      minPrice: brandGoods.length > 0
        ? Math.min(...brandGoods.map(p => p.price))
        : null,
      maxPrice: brandGoods.length > 0
        ? Math.max(...brandGoods.map(p => p.price))
        : null,
    };
  }).sort((a, b) => b.productCount - a.productCount); // Сортируем по количеству товаров

  return (
    <div>
      {/* Хлебные крошки */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-black transition-colors">
          Главная
        </Link>
        <span>/</span>
        <span className="text-black font-medium">Бренды</span>
      </div>

      {/* Заголовок */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Все бренды</h1>
            <p className="text-gray-600">
              Познакомьтесь с производителями, представленными в нашем магазине
            </p>
          </div>
          <Link href="/catalog">
            <Button variant="outline">
              <ShoppingBag className="mr-2 w-4 h-4" />
              В каталог
            </Button>
          </Link>
        </div>
        <div className="text-gray-600">
          Всего брендов: {brands.length} • Товаров: {goods.length}
        </div>
      </div>

      {/* Список брендов */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {brandsWithStats.map(brand => (
          <div
            key={brand.id}
            className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* Верхняя часть с логотипом */}
            <div className="p-6 pb-4">
              <div className="flex items-center justify-center h-32 mb-4 bg-gray-50 rounded-xl p-4">
                {brand.logo ? (
                  <Image
                    src={getSafeImageUrl(brand.logo)}
                    alt={brand.name}
                    width={120}
                    height={80}
                    className="object-contain max-h-20"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <Building2 className="w-16 h-16 text-gray-400 mb-2" />
                    <span className="text-lg font-bold">{brand.name}</span>
                  </div>
                )}
              </div>

              {/* Информация о бренде */}
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {brand.name}
                </h3>
                {brand.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {brand.description}
                  </p>
                )}
              </div>
            </div>

            {/* Статистика */}
            <div className="px-6 py-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm mb-3">
                <div className="text-gray-600">Товаров:</div>
                <div className="font-semibold">{brand.productCount}</div>
              </div>
              {brand.minPrice && brand.maxPrice && (
                <div className="flex items-center justify-between text-sm">
                  <div className="text-gray-600">Цены:</div>
                  <div className="font-semibold">
                    от {brand.minPrice.toLocaleString()} ₽
                  </div>
                </div>
              )}
            </div>

            {/* Футер с действиями */}
            <div className="px-6 pb-6 pt-4 border-t border-gray-100">
              <div className="flex gap-3">
                <Link
                  href={`/catalog?brand=${encodeURIComponent(brand.name)}`}
                  className="flex-1"
                >
                  <Button
                    variant="theme-primary"
                    size="sm"
                    fullWidth
                    disabled={brand.productCount === 0}
                  >
                    Товары ({brand.productCount})
                  </Button>
                </Link>

                {brand.website && (
                  <a
                    href={brand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    title="Сайт бренда"
                  >
                    <Globe className="w-4 h-4 text-gray-600" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Если нет брендов */}
      {brands.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-bold mb-2">Бренды пока не добавлены</h3>
          <p className="text-gray-600 mb-6">
            В магазине пока нет информации о брендах
          </p>
          <Link href="/catalog">
            <Button variant="theme-primary">
              Перейти в каталог
            </Button>
          </Link>
        </div>
      )}

      {/* Информация */}
      <div className="mt-12 p-6 bg-gray-50 rounded-2xl">
        <h3 className="font-bold text-lg mb-4">О брендах в нашем магазине</h3>
        <p className="text-gray-600 mb-4">
          Мы сотрудничаем только с проверенными производителями, которые гарантируют
          качество своей продукции. Каждый бренд проходит строгий отбор перед тем,
          как его товары появляются в нашем каталоге.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white p-4 rounded-lg">
            <div className="font-bold text-lg mb-2">Качество</div>
            <p className="text-sm text-gray-600">
              Все бренды соответствуют стандартам качества
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="font-bold text-lg mb-2">Доставка</div>
            <p className="text-sm text-gray-600">
              Быстрая доставка товаров от всех брендов
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="font-bold text-lg mb-2">Гарантия</div>
            <p className="text-sm text-gray-600">
              Гарантия возврата на товары всех брендов
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}