// Дефолтная конфигурация дизайна для новых магазинов

export const defaultDesignConfig = {
  theme: 'Минимализм',
  pages: {
    home: {
      blocks: [
        {
          type: 'hero',
          enabled: true,
          settings: {
            title: 'Добро пожаловать в наш магазин',
            subtitle: 'Откройте для себя мир качественных товаров',
            buttonText: 'Перейти в каталог',
            buttonLink: '/catalog'
          }
        },
        {
          type: 'categories',
          enabled: true,
          settings: {
            limit: 4,
            showDescription: true
          }
        },
        {
          type: 'products',
          enabled: true,
          settings: {
            limit: 8,
            showPrice: true,
            showDescription: true
          }
        },
        {
          type: 'news',
          enabled: true,
          settings: {
            limit: 3,
            showExcerpt: true
          }
        }
      ]
    }
  },
  header: {
    logo: null,
    menuItems: ['catalog', 'brands', 'news', 'about']
  },
  footer: {
    showSocial: true,
    links: []
  }
};

// Функция для создания designCode для нового магазина
export function createDefaultDesignCode(): string {
  return JSON.stringify(defaultDesignConfig);
}
