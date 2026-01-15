'use client';

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ShoppingCart, Heart, Share2 } from 'lucide-react'
import type { IGood } from '@/types'
import { useCartStore } from '@/store/cart.store'
import { useFavoritesStore } from '@/store/favorites.store'
import { productService } from '@/services/products.service'

interface ProductInteractivePartProps {
  product: IGood
}

export default function ProductInteractivePart({ product }: ProductInteractivePartProps) {
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [loadedSizes, setLoadedSizes] = useState<string[] | null>(null)

  // Добавляем useCartStore
  const { addToCart, isInCart, getItemQuantity } = useCartStore()
  const isInCartProduct = isInCart(String(product.id))
  const cartQuantity = getItemQuantity(String(product.id))

  const { toggleFavorite, isInFavorites } = useFavoritesStore()
  const isFavorite = isInFavorites(product.id)

  const sizes: string[] | undefined = (() => {
    if (product.sizes && product.sizes.length > 0) return product.sizes

    const raw = (product.attributes as any)?.sizes ?? (product.attributes as any)?.size
    if (!raw) return undefined

    if (Array.isArray(raw)) return raw.filter(Boolean).map(String)
    if (typeof raw === 'string') {
      const parts = raw
        .split(/[;,]/g)
        .map(s => s.trim())
        .filter(Boolean)
      return parts.length > 0 ? parts : undefined
    }

    return undefined
  })()

  useEffect(() => {
    const shouldLoad = !sizes || sizes.length === 0
    if (!shouldLoad) return
    if (loadedSizes) return

    // product-sizes endpoint expects UUID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(product.id))
    if (!isUuid) {
      setLoadedSizes([])
      return
    }

    let cancelled = false
    productService
      .getSizeNamesForProduct(product.id)
      .then((names) => {
        if (cancelled) return
        setLoadedSizes(names)
      })
      .catch(() => {
        if (cancelled) return
        setLoadedSizes([])
      })

    return () => {
      cancelled = true
    }
  }, [product.id, sizes, loadedSizes])

  const effectiveSizes = (sizes && sizes.length > 0)
    ? sizes
    : (loadedSizes && loadedSizes.length > 0 ? loadedSizes : undefined)

  const handleAddToCart = async () => {
    if (!product.inStock || (!selectedSize && effectiveSizes && effectiveSizes.length > 0)) {
      alert('Пожалуйста, выберите размер')
      return
    }

    try {
      await addToCart(String(product.id), quantity, selectedSize)
      alert(`Товар "${product.name}" добавлен в корзину (${quantity} шт.)`)
    } catch {
      // error is handled by store
    }
  }

  return (
    <>
      {/* Размеры */}
      {effectiveSizes && effectiveSizes.length > 0 && (
        <div className="mb-8">
          <h3 className="font-medium mb-3">Размер</h3>
          <div className="flex flex-wrap gap-2">
            {effectiveSizes.map(size => (
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
            disabled={!product.inStock || (!selectedSize && sizes && sizes.length > 0)}
            onClick={handleAddToCart}
            variant={isInCartProduct ? "secondary" : "theme-primary"}
          >
            <ShoppingCart className="mr-2" />
            {isInCartProduct ? `В корзине (${cartQuantity})` : 'Добавить в корзину'}
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant={isFavorite ? 'theme-primary' : 'outline'}
            onClick={() => toggleFavorite(product.id)}
          >
            <Heart className="mr-2" />
            {isFavorite ? 'В избранном' : 'В избранное'}
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
