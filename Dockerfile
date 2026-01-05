# 1. Базовый образ Node.js
FROM node:20-alpine AS base

# 2. Этап сборки зависимостей
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# 3. Этап сборки приложения
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Установка переменных окружения для сборки
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Сборка Next.js приложения
RUN npm run build

# 4. Этап продакшн
FROM base AS runner
WORKDIR /app

# Не запускаем от root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Копируем сборку из builder
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Порт
EXPOSE 3000

# Переменные окружения
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV=production

# Запуск приложения
CMD ["node", "server.js"]