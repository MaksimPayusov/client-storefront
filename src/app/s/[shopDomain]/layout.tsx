import { headers } from 'next/headers';
import { getShopByDomain, parseDesignCode } from '@/api/shops.api';
import { getThemeVariables } from '@/lib/theme-utils';
import { Metadata } from 'next';

// Server Component для загрузки данных магазина
async function getShopData(shopDomain: string) {
  try {
    const shop = await getShopByDomain(shopDomain);
    const designConfig = parseDesignCode(shop.designCode);
    const theme = designConfig.theme || 'Минимализм';
    
    return { shop, designConfig, theme };
  } catch (error) {
    console.error('Failed to load shop:', error);
    throw new Error('Shop not found');
  }
}

export async function generateMetadata({ params }: { params: { shopDomain: string } }): Promise<Metadata> {
  const { shop } = await getShopData(params.shopDomain);
  
  return {
    title: shop.shopName,
    description: shop.description || `Магазин ${shop.shopName}`,
  };
}

export default async function ShopLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { shopDomain: string };
}) {
  const { shop, designConfig, theme } = await getShopData(params.shopDomain);
  
  // Применяем тему через CSS переменные
  const themeStyles = getThemeVariables({
    primaryColor: themeConfig[theme]?.primaryColor || '#ffffff',
    secondaryColor: themeConfig[theme]?.secondaryColor || '#000000',
    backgroundColor: themeConfig[theme]?.backgroundColor || '#ffffff',
    textColor: themeConfig[theme]?.textColor || '#000000',
    accentColor: themeConfig[theme]?.accentColor || '#000000',
  });

  return (
    <html style={themeStyles}>
      <body className="min-h-screen">
        <ShopContext.Provider value={{ shop, designConfig, theme }}>
          <Header config={designConfig.header} shop={shop} />
          <main className="flex-1">
            {children}
          </main>
          <Footer config={designConfig.footer} />
        </ShopContext.Provider>
      </body>
    </html>
  );
}

// Импортируем themeConfig из theme-utils
import { themeConfig } from '@/lib/theme-utils';

// Context для передачи данных магазина
const ShopContext = React.createContext<{
  shop: any;
  designConfig: any;
  theme: string;
}>({
  shop: null,
  designConfig: null,
  theme: 'Минимализм',
});

// Экспортируем Provider для использования в компонентах
export { ShopContext };

// Временные компоненты Header и Footer (заглушки)
function Header({ config, shop }: { config?: any; shop: any }) {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">{shop.shopName}</h1>
          <nav className="flex gap-4">
            <a href={`/s/${shop.shopUrl}/catalog`} className="hover:underline">Каталог</a>
            <a href={`/s/${shop.shopUrl}/brands`} className="hover:underline">Бренды</a>
            <a href={`/s/${shop.shopUrl}/news`} className="hover:underline">Новости</a>
          </nav>
        </div>
      </div>
    </header>
  );
}

function Footer({ config }: { config?: any }) {
  return (
    <footer className="border-t mt-16">
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-sm opacity-70">
          © 2024 {config?.showSocial ? 'Shop' : 'Shop'}. Все права защищены.
        </p>
      </div>
    </footer>
  );
}
