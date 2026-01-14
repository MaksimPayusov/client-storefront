import { getShopByDomain, parseDesignCode } from '@/api/shops.api';
import { productsApi, categoriesApi } from '@/api/products.api';
import BlockRenderer from '@/components/BlockRenderer';

// Server Component для главной страницы магазина
async function getShopPageData(shopDomain: string) {
  // Получаем данные магазина
  const shop = await getShopByDomain(shopDomain);
  const designConfig = parseDesignCode(shop.designCode);
  
  // Получаем данные для блоков
  const [productsRes, categoriesRes] = await Promise.all([
    productsApi.getByShopId(shop.id),
    categoriesApi.getByShopId(shop.id),
  ]);
  
  return {
    shop,
    designConfig,
    products: productsRes.data,
    categories: categoriesRes.data,
  };
}

export default async function ShopHomePage({ params }: { params: { shopDomain: string } }) {
  const { shop, designConfig, products, categories } = await getShopPageData(params.shopDomain);
  
  // Получаем конфигурацию блоков для главной страницы
  const pageConfig = designConfig.pages?.home || {
    blocks: [
      { type: 'categories', enabled: true, settings: { limit: 4 } },
      { type: 'products', enabled: true, settings: { limit: 8 } },
      { type: 'news', enabled: true, settings: { limit: 3 } }
    ]
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <BlockRenderer 
        blocks={pageConfig.blocks} 
        products={products}
        categories={categories}
        shop={shop}
      />
    </div>
  );
}
