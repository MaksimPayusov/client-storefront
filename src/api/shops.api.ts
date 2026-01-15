// API client for shop data

export interface ShopData {
  id: string;
  shopName: string;
  shopUrl: string;
  description?: string;
  pfpUrl?: string;
  designCode: string;
  ownerId: string;
  createdAt: string;
  updatedAt?: string;
}

const API_URL =
  typeof window === 'undefined'
    ? (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081')
    : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081');

export async function getShopByDomain(domain: string): Promise<ShopData> {
  const res = await fetch(`${API_URL}/api/shops/url/${domain}`, {
    next: { revalidate: 60 }, // ISR: кэшировать на 60 секунд
  });

  if (!res.ok) {
    throw new Error(`Shop not found: ${domain}`);
  }

  return res.json();
}

// Парсинг designCode JSON
export function parseDesignCode(designCode: string) {
  try {
    // Иногда в designCode может приходить просто код/название темы (не JSON)
    if (typeof designCode === 'string') {
      const trimmed = designCode.trim();
      if (trimmed && !(trimmed.startsWith('{') || trimmed.startsWith('['))) {
        return {
          theme: trimmed,
          pages: {
            home: {
              blocks: [
                { type: 'categories', enabled: true, settings: { limit: 4 } },
                { type: 'products', enabled: true, settings: { limit: 8 } },
                { type: 'news', enabled: true, settings: { limit: 3 } }
              ]
            }
          }
        };
      }
    }

    return JSON.parse(designCode);
  } catch (error) {
    console.error('Failed to parse designCode:', error);
    return {
      theme: 'Минимализм',
      pages: {
        home: {
          blocks: [
            { type: 'categories', enabled: true, settings: { limit: 4 } },
            { type: 'products', enabled: true, settings: { limit: 8 } },
            { type: 'news', enabled: true, settings: { limit: 3 } }
          ]
        }
      }
    };
  }
}
