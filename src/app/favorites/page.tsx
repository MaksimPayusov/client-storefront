'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Heart, ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';
import { useFavoritesStore } from '@/store/favorites.store';
import { useShopStore } from '@/store/shop.store';
import ProductCard from '@/components/shared/ProductCard';

export default function FavoritesPage() {
  const { items, clearFavorites } = useFavoritesStore();
  const { goods } = useShopStore();

  // Получаем товары из избранного
  const favoriteProducts = goods.filter(product =>
    items.includes(product.id)
  );

  return (
    <div>
      {/* Хлебные крошки */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-black transition-colors">
          Главная
        </Link>
        <span>/</span>
        <span className="text-black font-medium">Избранное</span>
      </div>

      {/* Заголовок */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" fill="white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Избранное</h1>
              <p className="text-gray-600">
                Товары, которые вы сохранили для будущих покупок
              </p>
            </div>
          </div>

          {favoriteProducts.length > 0 && (
            <Button
              variant="outline"
              onClick={clearFavorites}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Очистить все
            </Button>
          )}
        </div>

        <div className="text-gray-600">
          {favoriteProducts.length} товаров
        </div>
      </div>

      {/* Если есть избранные товары */}
      {favoriteProducts.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favoriteProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => alert(`Товар "${product.name}" добавлен в корзину`)}
              />
            ))}
          </div>

          <div className="mt-12 flex justify-between items-center">
            <Link href="/catalog">
              <Button variant="outline">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Вернуться в каталог
              </Button>
            </Link>

            <div className="flex items-center gap-4">
              <Link href="/cart">
                <Button variant="theme-primary">
                  <ShoppingBag className="mr-2 w-4 h-4" />
                  Перейти в корзину
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* Если избранное пусто */
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold mb-4">Избранное пусто</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Добавляйте товары в избранное, нажимая на сердечко ❤️ на карточках товаров
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/catalog">
              <Button size="lg" variant="theme-primary">
                <ShoppingBag className="mr-2 w-5 h-5" />
                Перейти в каталог
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline">
                На главную
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}