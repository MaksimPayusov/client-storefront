## First, run the development server:
npm ci
npm run dev

## Open
[http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Структура проекта

src/
├── app/                    # Страницы Next.js App Router
│   ├── page.tsx           # Главная страница
│   ├── catalog/           # Каталог товаров
│   │   ├── page.tsx       # Весь каталог
│   │   └── [categoryId]/  # Категории товаров
│   ├── product/           # Страницы товаров
│   │   └── [productId]/
│   ├── cart/              # Корзина
│   ├── checkout/          # Оформление заказа
│   ├── account/           # Личный кабинет
│   │   └── orders/        # История заказов
│   ├── favorites/         # Избранные товары
│   ├── brands/            # Бренды магазина
│   ├── news/              # Новости/Блог
│   └── about/             # О магазине
│
├── components/            # React компоненты
│   ├── layout/           # Компоненты макета (Header, Footer, Layout)
│   ├── ui/               # Базовые UI компоненты (Button, Input)
│   ├── catalog/          # Компоненты каталога (CategoryTree)
│   ├── shared/           # Общие компоненты (ProductCard)
│   ├── cart/             # Компоненты корзины
│   └── theme/            # Компоненты темы
│
├── store/                # Zustand stores (состояние приложения)
│   ├── shop.store.ts     # Основные данные магазина
│   ├── cart.store.ts     # Корзина
│   ├── favorites.store.ts # Избранное
│   └── order.store.ts    # Заказы
│
├── hooks/                # Кастомные React хуки
│   └── useTheme.ts       # Работа с темой магазина
│
├── providers/            # React провайдеры
│   └── ShopProvider.tsx  # Провайдер данных магазина
│
├── lib/                  # Вспомогательные функции
│   ├── theme-utils.ts    # Утилиты работы с темами
│   ├── category-utils.ts # Работа с категориями
│   ├── mock-data.ts      # Моковые данные для разработки
│   └── utils.ts          # Общие утилиты
│
├── types/                # TypeScript типы
│   └── index.ts          # Все типы данных (товары, категории, etc.)
│
└── public/              # Статические файлы

### Ключевые файлы:

#### Для работы с данными:
src/store/shop.store.ts - главный store с товарами, категориями, брендами
src/types/index.ts - все TypeScript интерфейсы
src/lib/mock-data.ts - временные данные для разработки

#### Для API интеграции:
src/providers/ShopProvider.tsx - место для загрузки данных магазина
src/store/shop.store.ts - методы setShop, setCategories, etc. готовы к замене на API

#### Тема магазина:
src/lib/theme-utils.ts - конфигурация тем
src/components/theme/ - компоненты управления темой
src/hooks/useTheme.ts - хук для использования темы

## API эндпоинты:

### Магазин:
GET /api/shops/{domain} - данные магазина
GET /api/shops/{domain}/categories - дерево категорий
GET /api/shops/{domain}/goods - товары с фильтрацией
GET /api/shops/{domain}/brands - бренды магазина
GET /api/shops/{domain}/news - новости/статьи

### Товары:
GET /api/goods - список товаров с пагинацией
GET /api/goods/{id} - детали товара
GET /api/goods/category/{categoryId} - товары по категории

### Корзина:
GET /api/basket - получить корзину
POST /api/basket - добавить товар
PUT /api/basket/{id} - изменить количество
DELETE /api/basket/{id} - удалить товар

### Оформление заказа:
GET /api/checkout/payment-methods - методы оплаты
GET /api/checkout/delivery-methods - методы доставки
POST /api/checkout - создать заказ
GET /api/checkout/{id} - статус заказа
