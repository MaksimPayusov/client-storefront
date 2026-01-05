'use client';

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cart.store'
import { useShopStore } from '@/store/shop.store'
import { formatPrice, getSafeImageUrl } from '@/lib/utils'

export default function CartPage() {
  const {
    items,
    totalQuantity,
    updateQuantity,
    removeFromCart,
    clearCart
  } = useCartStore()

  const { goods } = useShopStore()

  // Получаем полную информацию о товарах в корзине
  const cartProducts = items.map(item => {
    const product = goods.find(p => p.id === item.productId)
    return {
      ...item,
      product,
      price: product?.price || 0,
      name: product?.name || 'Товар',
      image: product?.image,
      brand: product?.brand,
      inStock: product?.inStock ?? true
    }
  }).filter(item => item.product) // Фильтруем несуществующие товары

  // Расчеты
  const subtotal = cartProducts.reduce((sum, item) =>
    sum + item.price * item.quantity, 0
  );

  const shipping = subtotal > 5000 ? 0 : 399
  const total = subtotal + shipping

  const handleQuantityChange = (productId: number | string, newQuantity: number) => {
    const numericId = typeof productId === 'string' ? parseInt(productId, 10) : productId;
    if (newQuantity < 1) {
      removeFromCart(numericId)
    } else {
      updateQuantity(numericId, newQuantity)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Хлебные крошки */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-black transition-colors">
          Главная
        </Link>
        <span>/</span>
        <span className="text-black font-medium">Корзина</span>
      </div>

      <h1 className="text-3xl font-bold mb-8">Корзина</h1>

      {cartProducts.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <div className="text-5xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold mb-2">Корзина пуста</h2>
          <p className="text-gray-600 mb-6">Добавьте товары из каталога</p>
          <Link href="/catalog">
            <Button size="lg" variant="theme-primary">
              <ShoppingBag className="mr-2 w-5 h-5" />
              Перейти в каталог
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Список товаров */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                  Товары в корзине ({totalQuantity})
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  Очистить корзину
                </Button>
              </div>

              <div className="space-y-6">
                {cartProducts.map((item) => (
                  <div
                    key={`${item.productId}-${item.size || 'default'}`}
                    className="flex flex-col sm:flex-row gap-6 p-4 border rounded-xl hover:shadow-sm transition-shadow"
                  >
                    {/* Изображение */}
                    <div className="w-32 h-32 flex-shrink-0 relative rounded-xl overflow-hidden bg-gray-100">
                      {item.image ? (
                        <Image
                          src={getSafeImageUrl(item.image)}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ShoppingBag className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Информация */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1">
                          <Link
                            href={`/product/${item.productId}`}
                            className="group"
                          >
                            <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                              {item.name}
                            </h3>
                          </Link>

                          {item.brand && (
                            <p className="text-sm text-gray-600 mb-2">
                              Бренд: {item.brand}
                            </p>
                          )}

                          {item.size && (
                            <p className="text-sm text-gray-600 mb-3">
                              Размер: <span className="font-medium">{item.size}</span>
                            </p>
                          )}

                          {/* Цены */}
                          <div className="flex items-center gap-3 mb-4">
                            <div className="text-xl font-bold">
                              {formatPrice(item.price)}
                            </div>
                          </div>
                        </div>

                        {/* Управление количеством */}
                        <div className="flex flex-col sm:items-end gap-4">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center border rounded-lg">
                              <button
                                onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                                className="px-4 py-2 hover:bg-gray-100 rounded-l-lg transition-colors"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="px-4 py-2 border-x min-w-[60px] text-center font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                                className="px-4 py-2 hover:bg-gray-100 rounded-r-lg transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.productId)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Удалить"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="text-xl font-bold text-right">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                        </div>
                      </div>

                      {!item.inStock && (
                        <div className="mt-3 px-3 py-2 bg-yellow-50 text-yellow-800 rounded-lg text-sm">
                          ⚠️ Этот товар временно отсутствует на складе
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-6 mt-6 border-t">
                <Link href="/catalog">
                  <Button variant="outline">
                    ← Продолжить покупки
                  </Button>
                </Link>

                <div className="text-sm text-gray-600">
                  {totalQuantity} товар{totalQuantity > 1 ? 'а' : ''} на сумму {formatPrice(subtotal)}
                </div>
              </div>
            </div>

            {/* Промокод */}
            <div className="bg-white rounded-2xl border p-6">
              <h3 className="text-lg font-bold mb-4">Промокод</h3>
              <div className="flex gap-3">
                <Input
                  placeholder="Введите промокод"
                  className="flex-1"
                />
                <Button variant="outline">Применить</Button>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                Примеры промокодов: WELCOME10, SUMMER20, FREESHIP
              </p>
            </div>
          </div>

          {/* Итоговая информация */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl border p-6 mb-6">
                <h3 className="text-xl font-bold mb-6">Итого</h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Товары ({totalQuantity})</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Доставка</span>
                    <span>{shipping === 0 ? 'Бесплатно' : formatPrice(shipping)}</span>
                  </div>

                  {subtotal < 5000 && (
                    <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                      🎉 Добавьте товаров на {formatPrice(5000 - subtotal)} для бесплатной доставки!
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <div className="flex justify-between text-xl font-bold">
                      <span>К оплате</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                <Link href="/checkout">
                  <Button
                    size="lg"
                    className="w-full"
                    disabled={cartProducts.length === 0}
                  >
                    Перейти к оформлению
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>

                <p className="text-xs text-gray-500 mt-4 text-center">
                  Нажимая на кнопку, вы соглашаетесь с условиями обработки персональных данных
                </p>
              </div>

              {/* Дополнительная информация */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h4 className="font-bold mb-4">Безопасная оплата</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                    </div>
                    <div>
                      <div className="font-medium">SSL шифрование</div>
                      <div className="text-gray-600">Ваши данные защищены</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    </div>
                    <div>
                      <div className="font-medium">Гарантия возврата</div>
                      <div className="text-gray-600">14 дней на возврат</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}