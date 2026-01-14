// Блок товаров для главной страницы

import { Product } from '@/api/products.api';
import Link from 'next/link';

interface ProductsBlockProps {
  settings?: {
    limit?: number;
    showPrice?: boolean;
    showDescription?: boolean;
  };
  products?: Product[];
  shop?: any;
}

export default function ProductsBlock({ 
  settings = {}, 
  products = [], 
  shop 
}: ProductsBlockProps) {
  const { limit = 8, showPrice = true, showDescription = true } = settings;
  
  // Фильтруем только активные товары
  const activeProducts = products.filter(p => p.isActive !== false);
  
  // Ограничиваем количество
  const displayProducts = activeProducts.slice(0, limit);
  
  if (displayProducts.length === 0) {
    return null;
  }
  
  return (
    <section className="mb-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">Товары</h2>
        <Link 
          href={`/s/${shop?.shopUrl}/catalog`} 
          className="text-black hover:underline font-medium"
        >
          Все товары →
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayProducts.map((product) => (
          <Link
            key={product.id}
            href={`/s/${shop?.shopUrl}/product/${product.id}`}
            className="group"
          >
            <div className="bg-white rounded-2xl border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              {/* Изображение товара */}
              <div className="relative h-48 overflow-hidden">
                {product.imageUrls && product.imageUrls.length > 0 ? (
                  <img
                    src={product.imageUrls[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                    <div className="w-12 h-12 text-gray-400">📦</div>
                  </div>
                )}
              </div>
              
              {/* Информация о товаре */}
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {product.name}
                </h3>
                
                {showDescription && product.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                )}
                
                {showPrice && (
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold">
                      {new Intl.NumberFormat('ru-RU', {
                        style: 'currency',
                        currency: 'RUB',
                      }).format(product.price)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
