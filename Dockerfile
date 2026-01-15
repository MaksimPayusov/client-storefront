# Dockerfile (production)
FROM node:20-alpine
WORKDIR /app

# 1. Копируем package.json для установки всех зависимостей
COPY package.json package-lock.json* ./

# 2. Устанавливаем ВСЕ зависимости (включая devDependencies для сборки)
RUN npm ci

# 3. Копируем исходный код
COPY . .

# 4. Устанавливаем переменные окружения (значения запекаются на этапе build)
ARG NEXT_PUBLIC_SHOP_DOMAIN=fashionstore
ARG NEXT_PUBLIC_API_URL=http://localhost:8081
ARG API_URL=http://krakend:8081

ENV NODE_ENV=production
ENV NEXT_PUBLIC_DEBUG=false
ENV NEXT_PUBLIC_SHOP_DOMAIN=$NEXT_PUBLIC_SHOP_DOMAIN
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV API_URL=$API_URL
ENV NEXT_TELEMETRY_DISABLED=1

# 5. Собираем приложение
RUN npm run build

# Для standalone режима нужно вручную скопировать статические ассеты
RUN mkdir -p .next/standalone/.next && cp -r .next/static .next/standalone/.next/static
RUN cp -r public .next/standalone/public

# 6. Удаляем devDependencies после сборки (опционально, для уменьшения размера)
RUN npm prune --production

EXPOSE 3000

# Используем standalone сервер для production
CMD ["node", ".next/standalone/server.js"]
