// Компонент для рендеринга динамических блоков страницы

import { Product, Category } from '@/api/products.api';
import CategoriesBlock from './blocks/CategoriesBlock';
import ProductsBlock from './blocks/ProductsBlock';
import NewsBlock from './blocks/NewsBlock';
import HeroBlock from './blocks/HeroBlock';

interface BlockRendererProps {
  blocks: Array<{
    type: string;
    enabled: boolean;
    settings?: Record<string, any>;
  }>;
  products?: Product[];
  categories?: Category[];
  shop?: any;
}

// Карта компонентов блоков
const blockComponents = {
  hero: HeroBlock,
  categories: CategoriesBlock,
  products: ProductsBlock,
  news: NewsBlock,
  banner: null, // TODO: Implement
  testimonials: null, // TODO: Implement
};

export default function BlockRenderer({ blocks, products = [], categories = [], shop }: BlockRendererProps) {
  return (
    <>
      {blocks
        .filter(block => block.enabled)
        .map((block, index) => {
          const Component = blockComponents[block.type as keyof typeof blockComponents];
          
          if (!Component) {
            console.warn(`Block type "${block.type}" not found`);
            return null;
          }
          
          return (
            <Component
              key={`${block.type}-${index}`}
              settings={block.settings || {}}
              products={products}
              categories={categories}
              shop={shop}
            />
          );
        })}
    </>
  );
}
