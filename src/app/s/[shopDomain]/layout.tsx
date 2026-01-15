import { getShopByDomain, parseDesignCode } from '@/api/shops.api';
import { getThemeVariables, themeConfig } from '@/lib/theme-utils';
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
    const shop = {
      id: 'not-created',
      shopName: 'Магазин еще не создан',
      shopUrl: shopDomain,
      description: 'Создайте магазин в админ-панели, чтобы здесь появились данные.',
      pfpUrl: undefined,
      designCode: '{}',
      ownerId: 'unknown',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const designConfig = parseDesignCode(shop.designCode);
    const theme = designConfig.theme || 'Минимализм';
    return { shop, designConfig, theme };
  }
}

export async function generateMetadata({ params }: { params: Promise<{ shopDomain: string }> }): Promise<Metadata> {
  const { shopDomain } = await params;
  const { shop } = await getShopData(shopDomain);

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
  params: Promise<{ shopDomain: string }>;
}) {
  const { shopDomain } = await params;
  const { shop, designConfig, theme } = await getShopData(shopDomain);

  // Применяем тему через CSS переменные
  const themeStyles = getThemeVariables({
    primaryColor: themeConfig[theme as keyof typeof themeConfig]?.primaryColor || '#ffffff',
    secondaryColor: themeConfig[theme as keyof typeof themeConfig]?.secondaryColor || '#000000',
    backgroundColor: themeConfig[theme as keyof typeof themeConfig]?.backgroundColor || '#ffffff',
    textColor: themeConfig[theme as keyof typeof themeConfig]?.textColor || '#000000',
    accentColor: themeConfig[theme as keyof typeof themeConfig]?.accentColor || '#000000',
  });

  return (
    <div style={themeStyles} className="min-h-screen">
      <Header config={designConfig.header} shop={shop} />
      <main className="flex-1">
        {children}
      </main>
      <Footer config={designConfig.footer} />
    </div>
  );
}

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
