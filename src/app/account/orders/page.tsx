'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Package, Calendar, Truck, CreditCard, Search } from 'lucide-react';
import { useOrderStore, type Order } from '@/store/order.store';
import { useShopStore } from '@/store/shop.store';
import { cn } from '@/lib/utils';

export default function OrdersPage() {
  const { orders, getUserOrders, loadOrders, isLoading } = useOrderStore();
  const { goods } = useShopStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const userOrders = getUserOrders();

  // Фильтрация заказов
  const filteredOrders = userOrders.filter(order => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Получение товаров заказа
  const getOrderItems = (order: Order) => {
    return order.items.map(item => {
      const product = goods.find(p => p.id === item.productId);
      return {
        ...item,
        product,
        image: product?.image,
      };
    });
  };

  // Форматирование статуса
  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'NEW': return { text: 'Новый', color: 'bg-yellow-100 text-yellow-800' };
      case 'PAID': return { text: 'Оплачен', color: 'bg-blue-100 text-blue-800' };
      case 'SHIPPED': return { text: 'Отправлен', color: 'bg-purple-100 text-purple-800' };
      case 'COMPLETED': return { text: 'Выполнен', color: 'bg-green-100 text-green-800' };
      case 'CANCELED': return { text: 'Отменен', color: 'bg-red-100 text-red-800' };
      default: return { text: 'Неизвестно', color: 'bg-gray-100 text-gray-800' };
    }
  };

  // Группировка по году
  const ordersByYear = filteredOrders.reduce((acc, order) => {
    const year = new Date(order.createdAt).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(order);
    return acc;
  }, {} as Record<number, Order[]>);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Хлебные крошки */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-black transition-colors">
          Главная
        </Link>
        <span>/</span>
        <span className="text-black font-medium">Мои заказы</span>
      </div>

      {/* Заголовок */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Мои заказы</h1>
              <p className="text-gray-600">
                История всех ваших заказов
              </p>
            </div>
          </div>

          <Link href="/catalog">
            <Button variant="outline">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Вернуться в магазин
            </Button>
          </Link>
        </div>

        <div className="text-gray-600">
          Всего заказов: {userOrders.length}
        </div>
      </div>

      {/* Фильтры и поиск */}
      <div className="bg-white rounded-2xl border p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Поиск */}
          <div>
            <label className="block text-sm font-medium mb-2">Поиск заказов</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="По номеру или имени"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Фильтр по статусу */}
          <div>
            <label className="block text-sm font-medium mb-2">Статус заказа</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Все статусы</option>
              <option value="NEW">Новый</option>
              <option value="PAID">Оплачен</option>
              <option value="SHIPPED">Отправлен</option>
              <option value="COMPLETED">Выполнен</option>
              <option value="CANCELED">Отменен</option>
            </select>
          </div>
        </div>
      </div>

      {/* Если есть заказы */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-8">
          {Object.entries(ordersByYear)
            .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
            .map(([year, yearOrders]) => (
              <div key={year}>
                <h2 className="text-xl font-bold mb-4">{year} год</h2>
                <div className="space-y-4">
                  {yearOrders.map((order) => {
                    const status = getStatusText(order.status);
                    const orderItems = getOrderItems(order);

                    return (
                      <div
                        key={order.id}
                        className="bg-white rounded-2xl border overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        {/* Шапка заказа */}
                        <div className="p-6 border-b">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-bold">
                                  Заказ #{order.id.slice(0, 8)}
                                </h3>
                                <span className={cn(
                                  "px-3 py-1 rounded-full text-xs font-medium",
                                  status.color
                                )}>
                                  {status.text}
                                </span>
                              </div>

                              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  <span>
                                    {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                                      day: 'numeric',
                                      month: 'long',
                                    })}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <Truck className="w-4 h-4" />
                                  <span>{order.deliveryMethod.name}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <CreditCard className="w-4 h-4" />
                                  <span>{order.paymentMethod.name}</span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-2xl font-bold mb-1">
                                {order.totalAmount.toLocaleString()} ₽
                              </div>
                              <div className="text-sm text-gray-600">
                                {order.items.length} товар{order.items.length > 1 ? 'а' : ''}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Товары заказа */}
                        <div className="p-6">
                          <div className="mb-4">
                            <h4 className="font-medium mb-2">Товары:</h4>
                            <div className="space-y-3">
                              {orderItems.slice(0, 2).map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                      {item.image ? (
                                        <img
                                          src={item.image}
                                          alt={item.product?.name || 'Товар'}
                                          className="w-full h-full object-cover rounded-lg"
                                        />
                                      ) : (
                                        <Package className="w-6 h-6 text-gray-400" />
                                      )}
                                    </div>
                                    <div>
                                      <p className="font-medium">{item.product?.name || item.productId}</p>
                                      <p className="text-sm text-gray-600">
                                        {item.quantity} × {item.pricePerItem.toLocaleString()} ₽
                                      </p>
                                    </div>
                                  </div>
                                  <div className="font-bold">
                                    {(item.pricePerItem * item.quantity).toLocaleString()} ₽
                                  </div>
                                </div>
                              ))}
                            </div>

                            {orderItems.length > 2 && (
                              <div className="mt-3 text-center">
                                <span className="text-sm text-gray-600">
                                  и ещё {orderItems.length - 2} товар{orderItems.length - 2 > 1 ? 'а' : ''}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Кнопка повтора заказа */}
                          <div className="flex justify-between items-center pt-4 border-t">
                            <div className="text-sm text-gray-600">
                              {order.yandexPickupPointAddress
                                ? `Пункт выдачи: ${order.yandexPickupPointAddress}`
                                : `Получатель ID: ${order.recipientId}`}
                            </div>
                            <Link href={`/checkout/success?orderId=${order.id}`}>
                              <Button variant="outline" size="sm">
                                Детали заказа
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>
      ) : (
        /* Если заказов нет */
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold mb-4">
            {userOrders.length === 0 ? 'Заказов пока нет' : 'Заказы не найдены'}
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {userOrders.length === 0
              ? 'Сделайте свой первый заказ, чтобы он появился здесь'
              : 'Попробуйте изменить параметры поиска'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/catalog">
              <Button size="lg" variant="theme-primary">
                Перейти в каталог
              </Button>
            </Link>
            {userOrders.length > 0 && (
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
              >
                Сбросить фильтры
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
