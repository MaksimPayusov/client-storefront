# Dockerfile (production)
FROM node:20-alpine
WORKDIR /app

# 1. Копируем package.json для установки всех зависимостей
COPY package.json package-lock.json* ./

# 2. Устанавливаем ВСЕ зависимости (включая devDependencies для сборки)
RUN npm ci

# 3. Копируем исходный код
COPY . .

# 4. Устанавливаем переменные окружения
ENV NODE_ENV=production
ENV NEXT_PUBLIC_DEBUG=false
ENV NEXT_PUBLIC_SHOP_DOMAIN=fashion-store
ENV NEXT_TELEMETRY_DISABLED=1

# 5. Собираем приложение
RUN npm run build

# 6. Удаляем devDependencies после сборки (опционально, для уменьшения размера)
RUN npm prune --production

EXPOSE 3000

# Используем standalone сервер для production
CMD ["node", ".next/standalone/server.js"]
