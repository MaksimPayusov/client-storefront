'use client';

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { ShoppingCart, X, Trash2 } from 'lucide-react'
import { useCartStore } from '@/store/cart.store'
import { useShopStore } from '@/store/shop.store'
import { formatPrice, getSafeImageUrl } from '@/lib/utils'
import { cn } from '@/lib/utils'

export function CartMini() {
  const [isOpen, setIsOpen] = useState(false)
  const { items, totalQuantity, removeFromCart, updateQuantity } = useCartStore()
  const { goods } = useShopStore()

  const cartProducts = items.map(item => {
    const product = goods.find(p => p.id === item.productId)
    return {
      ...item,
      product,
      price: product?.price || 0,
      name: product?.name || 'Товар',
      image: product?.image,
    }
  }).filter(item => item.product)

  const subtotal = cartProducts.reduce((sum, item) =>
    sum + item.price * item.quantity, 0
  )

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-4 bg-black text-white rounded-full shadow-2xl hover:scale-110 transition-all"
      >
        <ShoppingCart className="w-6 h-6" />
        {totalQuantity > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
            {totalQuantity}
          </span>
        )}
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Корзина */}
      <div className="absolute right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl animate-in slide-in-from-right">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-6 h-6" />
              <h2 className="text-xl font-bold">Корзина ({totalQuantity})</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {cartProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🛒</div>
                <p className="text-gray-600 mb-6">Корзина пуста</p>
                <Link href="/catalog">
                  <Button onClick={() => setIsOpen(false)}>
                    Перейти в каталог
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cartProducts.map((item) => (
                  <div key={`${item.productId}-${item.size}`} className="flex gap-4 p-4 border rounded-lg">
                    <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100">
                      {item.image ? (
                        <Image
                          src={getSafeImageUrl(item.image)}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ShoppingCart className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <Link
                        href={`/product/${item.productId}`}
                        onClick={() => setIsOpen(false)}
                        className="font-medium hover:text-primary transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>

                      {item.size && (
                        <p className="text-sm text-gray-600">Размер: {item.size}</p>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center border rounded"
                          >
                            -
                          </button>
                          <span className="font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center border rounded"
                          >
                            +
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="font-bold">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartProducts.length > 0 && (
            <div className="border-t p-6">
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">Итого:</span>
                <span className="text-xl font-bold">{formatPrice(subtotal)}</span>
              </div>

              <div className="space-y-3">
                <Link href="/cart">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => setIsOpen(false)}
                  >
                    Перейти в корзину
                  </Button>
                </Link>

                <Link href="/checkout">
                  <Button
                    variant="theme-primary"
                    fullWidth
                    onClick={() => setIsOpen(false)}
                  >
                    Оформить заказ
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}