#### npm install axios zustand
#### npm ci

## Созданы все необходимые файлы для интеграции:
- constants/api.endpoints.ts - константы API
- services/api.ts - HTTP клиент с JWT поддержкой
- services/auth.service.ts - аутентификация через Keycloak
- services/shop.service.ts - работа с магазинами
- services/products.service.ts - товары, категории, бренды
- services/cart.service.ts - корзина
- services/orders.service.ts - заказы
- services/news.service.ts - новости

## Обновлены существующие файлы:
- .env.local - переменные окружения
- store/auth.store.ts - реальная аутентификация
- store/shop.store.ts - загрузка магазина с API
- store/cart.store.ts - синхронизация с бэкендом
- store/order.store.ts - новый файл для заказов
- middleware.ts - проверка JWT токена
- providers/AuthProvider.tsx - инициализация сессии
- providers/ShopProvider.tsx - определение магазина по домену
