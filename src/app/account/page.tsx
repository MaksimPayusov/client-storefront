'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { User, Package, Heart, Settings, LogOut } from 'lucide-react';
import { useOrderStore } from '@/store/order.store';
import { useFavoritesStore } from '@/store/favorites.store';

export default function AccountPage() {
  const { getUserOrders } = useOrderStore();
  const { items } = useFavoritesStore();

  const orders = getUserOrders();
  const favoritesCount = items.length;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Хлебные крошки */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-black transition-colors">
          Главная
        </Link>
        <span>/</span>
        <span className="text-black font-medium">Личный кабинет</span>
      </div>

      {/* Заголовок */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Личный кабинет</h1>
            <p className="text-gray-600">
              Управление вашими заказами и настройками
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Левая колонка - меню */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl border p-6 sticky top-24">
            <nav className="space-y-2">
              <Link
                href="/account/orders"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 hover:text-black"
              >
                <Package className="w-5 h-5" />
                <span className="font-medium">Мои заказы</span>
                {orders.length > 0 && (
                  <span className="ml-auto bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                    {orders.length}
                  </span>
                )}
              </Link>

              <Link
                href="/favorites"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 hover:text-black"
              >
                <Heart className="w-5 h-5" />
                <span className="font-medium">Избранное</span>
                {favoritesCount > 0 && (
                  <span className="ml-auto bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                    {favoritesCount}
                  </span>
                )}
              </Link>

              <button
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 hover:text-black w-full text-left"
                onClick={() => alert('Настройки пока не доступны')}
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">Настройки</span>
              </button>

              <button
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-red-600 hover:text-red-700 w-full text-left"
                onClick={() => alert('Выход пока не реализован')}
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Выйти</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Правая колонка - основное */}
        <div className="md:col-span-2">
          {/* Статистика */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <Package className="w-8 h-8 text-blue-600" />
                <span className="text-2xl font-bold">{orders.length}</span>
              </div>
              <h3 className="font-bold mb-1">Всего заказов</h3>
              <p className="text-sm text-gray-600">
                {orders.length === 0 ? 'Сделайте первый заказ' : 'История ваших покупок'}
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <Heart className="w-8 h-8 text-red-600" />
                <span className="text-2xl font-bold">{favoritesCount}</span>
              </div>
              <h3 className="font-bold mb-1">Избранные товары</h3>
              <p className="text-sm text-gray-600">
                {favoritesCount === 0 ? 'Добавьте первый товар' : 'Товары для будущих покупок'}
              </p>
            </div>
          </div>

          {/* Последние заказы */}
          <div className="bg-white rounded-2xl border p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Последние заказы</h2>
              <Link href="/account/orders">
                <Button variant="ghost" size="sm">
                  Все заказы →
                </Button>
              </Link>
            </div>

            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.slice(0, 3).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <h3 className="font-medium mb-1">Заказ #{order.orderNumber}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('ru-RU')} • {order.items.length} товар{order.items.length > 1 ? 'а' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{order.total.toLocaleString()} ₽</div>
                      <div className="text-xs text-gray-500 capitalize">
                        {order.status === 'pending' && 'Ожидает'}
                        {order.status === 'processing' && 'В обработке'}
                        {order.status === 'shipped' && 'Отправлен'}
                        {order.status === 'delivered' && 'Доставлен'}
                        {order.status === 'cancelled' && 'Отменен'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">У вас пока нет заказов</p>
                <Link href="/catalog">
                  <Button variant="theme-primary">
                    Сделать первый заказ
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Приветствие */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Добро пожаловать!</h2>
            <p className="text-gray-300 mb-6">
              Рады видеть вас в личном кабинете. Здесь вы можете управлять заказами,
              просматривать избранное и настраивать аккаунт.
            </p>
            <div className="flex gap-4">
              <Link href="/catalog">
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  Перейти в магазин
                </Button>
              </Link>
              <Link href="/account/orders">
                <Button className="bg-white text-black hover:bg-gray-200">
                  Мои заказы
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}