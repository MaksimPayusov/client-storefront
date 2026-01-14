'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn, formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import type { IGood } from '@/types';
import { useTheme } from '@/hooks/useTheme';
import { getSafeImageUrl } from '@/lib/utils';
import { useFavoritesStore } from '@/store/favorites.store';
import { useCartStore } from '@/store/cart.store'

interface ProductCardProps {
  product: IGood;
  className?: string;
  showDescription?: boolean;
  showAddToCart?: boolean;
  onAddToCart?: (product: IGood) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className,
  showDescription = false,
  showAddToCart = true,
  onAddToCart,
}) => {
  const { theme, styles } = useTheme();

  // Используем store избранного
  const { toggleFavorite, isInFavorites } = useFavoritesStore();
  const isFavorite = isInFavorites(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!product.inStock) return

    addToCart(String(product.id), 1, product.sizes?.[0])

    // Показываем уведомление (в реальности можно использовать toast)
    if (onAddToCart) {
      onAddToCart(product)
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    alert(`Быстрый просмотр: ${product.name}`);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  const { addToCart, isInCart, getItemQuantity } = useCartStore()
  const isInCartProduct = isInCart(String(product.id))
  const cartQuantity = getItemQuantity(String(product.id))

  return (
    <Link
      href={`/product/${product.id}`}
      className={cn(
        'group relative block bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2',
        'hover:border-gray-300',
        className
      )}
    >
      {/* Кнопки действий при наведении */}
      <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2">
        <button
          onClick={handleQuickView}
          className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all"
          title="Быстрый просмотр"
        >
          <Eye className="w-4 h-4 text-gray-700" />
        </button>
        <button
          onClick={handleToggleFavorite}
          className={cn(
            "w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all",
            isFavorite ? "text-red-500" : "text-gray-700 hover:text-red-500"
          )}
          title={isFavorite ? "Удалить из избранного" : "В избранное"}
        >
          <Heart className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Изображение товара */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {product.image ? (
          <>
            <Image
              src={getSafeImageUrl(product.image)}
              alt={product.name}
              width={400}
              height={400}
              className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">👕</div>
              <p className="text-sm text-gray-500">Изображение</p>
            </div>
          </div>
        )}
      </div>

      {/* Контент */}
      <div className="p-5">
        {/* Бренд */}
        {product.brand && (
          <p className="text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
            {product.brand}
          </p>
        )}

        {/* Название */}
        <h3 className="font-semibold text-gray-900 mb-2.5 line-clamp-2 min-h-[2.5rem] group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        {/* Цена */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
        </div>

        {/* Размеры */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Размеры:</p>
            <div className="flex flex-wrap gap-1.5">
              {product.sizes.slice(0, 4).map((size) => (
                <span
                  key={size}
                  className="px-2.5 py-1 text-xs border border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  {size}
                </span>
              ))}
              {product.sizes.length > 4 && (
                <span className="px-2.5 py-1 text-xs text-gray-500">
                  +{product.sizes.length - 4}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Кнопка "В корзину" */}
        {showAddToCart && (
          <Button
            variant={isInCartProduct ? "secondary" : "theme-primary"}
            size="sm"
            fullWidth
            disabled={!product.inStock}
            onClick={handleAddToCart}
            className={cn(
              'transition-all duration-300',
              product.inStock
                ? 'hover:scale-[1.02]'
                : 'opacity-60 cursor-not-allowed'
            )}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isInCartProduct ? `В корзине (${cartQuantity})` : product.inStock ? 'В корзину' : 'Нет в наличии'}
          </Button>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
