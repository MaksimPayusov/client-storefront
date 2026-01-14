// Блок категорий для главной страницы

import { Category } from '@/api/products.api';
import Link from 'next/link';

interface CategoriesBlockProps {
  settings?: {
    limit?: number;
    showDescription?: boolean;
  };
  categories?: Category[];
  shop?: any;
}

export default function CategoriesBlock({ 
  settings = {}, 
  categories = [], 
  shop 
}: CategoriesBlockProps) {
  const { limit = 4, showDescription = true } = settings;
  
  // Фильтруем корневые категории (без parentId)
  const rootCategories = categories.filter(cat => !cat.parentId);
  
  // Ограничиваем количество
  const displayCategories = rootCategories.slice(0, limit);
  
  if (displayCategories.length === 0) {
    return null;
  }
  
  return (
    <section className="mb-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">Категории</h2>
        <Link 
          href={`/s/${shop?.shopUrl}/catalog`} 
          className="text-black hover:underline font-medium"
        >
          Все категории →
        </Link>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {displayCategories.map((category) => (
          <Link
            key={category.id}
            href={`/s/${shop?.shopUrl}/catalog/${category.id}`}
            className="group relative overflow-hidden rounded-xl bg-gray-100 aspect-square"
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              <h3 className="text-lg font-semibold text-center">{category.title}</h3>
              {showDescription && (
                <p className="text-sm text-gray-600 mt-2 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                  Категория товаров
                </p>
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>
    </section>
  );
}
