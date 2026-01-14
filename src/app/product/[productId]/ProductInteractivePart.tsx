'use client';

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ShoppingCart, Heart, Share2 } from 'lucide-react'
import type { IGood } from '@/types'
import { useCartStore } from '@/store/cart.store'

interface ProductInteractivePartProps {
  product: IGood
}

export default function ProductInteractivePart({ product }: ProductInteractivePartProps) {
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [quantity, setQuantity] = useState(1)

  // Добавляем useCartStore
  const { addToCart, isInCart, getItemQuantity } = useCartStore()
  const isInCartProduct = isInCart(String(product.id))
  const cartQuantity = getItemQuantity(String(product.id))

  const handleAddToCart = () => {
    if (!product.inStock || (!selectedSize && product.sizes && product.sizes.length > 0)) {
      alert('Пожалуйста, выберите размер')
      return
    }

    addToCart(String(product.id), quantity, selectedSize)
    alert(`Товар "${product.name}" добавлен в корзину (${quantity} шт.)`)
  }

  return (
    <>
      {/* Размеры */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="mb-8">
          <h3 className="font-medium mb-3">Размер</h3>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 border rounded-lg transition-all ${
                  selectedSize === size
                    ? 'border-black bg-black text-white'
                    : 'border-gray-300 hover:border-black'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Количество и кнопки */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center border rounded-lg">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="px-4 py-2 text-lg hover:bg-gray-100 rounded-l-lg transition-colors"
            >
              -
            </button>
            <span className="px-4 py-2 border-x min-w-[60px] text-center font-medium">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(q => q + 1)}
              className="px-4 py-2 text-lg hover:bg-gray-100 rounded-r-lg transition-colors"
            >
              +
            </button>
          </div>
          <Button
            size="lg"
            className="flex-1"
            disabled={!product.inStock || (!selectedSize && product.sizes && product.sizes.length > 0)}
            onClick={handleAddToCart}
            variant={isInCartProduct ? "secondary" : "theme-primary"}
          >
            <ShoppingCart className="mr-2" />
            {isInCartProduct ? `В корзине (${cartQuantity})` : 'Добавить в корзину'}
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Heart className="mr-2" />
            В избранное
          </Button>
          <Button variant="outline">
            <Share2 className="mr-2" />
            Поделиться
          </Button>
        </div>
      </div>
    </>
  )
}
