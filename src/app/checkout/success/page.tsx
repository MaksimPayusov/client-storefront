'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { CheckCircle, Home, ShoppingBag, Package, Mail, Phone } from 'lucide-react';
import { useOrderStore, type Order } from '@/store/order.store';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Получаем orderId из URL на клиенте
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('orderId');
      setOrderId(id);

      if (!id) {
        router.push('/');
        return;
      }

      // Имитация загрузки заказа
      setTimeout(() => {
        const orderStore = useOrderStore.getState();
        const foundOrder = orderStore.getOrderById(id);

        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          router.push('/');
        }
        setLoading(false);
      }, 500);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Загружаем информацию о заказе...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">😕</div>
          <h1 className="text-2xl font-bold mb-4">Заказ не найден</h1>
          <p className="text-gray-600 mb-6">
            К сожалению, мы не смогли найти информацию о вашем заказе
          </p>
          <Link href="/">
            <Button variant="theme-primary">
              <Home className="mr-2 w-5 h-5" />
              На главную
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        <h1 className="text-4xl font-bold mb-4">Заказ оформлен!</h1>
        <p className="text-xl text-gray-600 mb-6">
          Спасибо за ваш заказ #{order.orderNumber}
        </p>
        <p className="text-gray-600">
          Мы отправили подтверждение на email{' '}
          <span className="font-semibold">{order.shippingAddress.email}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Информация о заказе */}
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="text-xl font-bold mb-6">Информация о заказе</h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Номер заказа</p>
              <p className="font-bold text-lg">{order.orderNumber}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Дата оформления</p>
              <p className="font-medium">
                {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Статус</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {order.status === 'PENDING' && 'Ожидает обработки'}
                {order.status === 'PROCESSING' && 'В обработке'}
                {order.status === 'SHIPPED' && 'Отправлен'}
                {order.status === 'DELIVERED' && 'Доставлен'}
                {order.status === 'CANCELLED' && 'Отменен'}
              </span>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Сумма заказа</p>
              <p className="font-bold text-2xl">{order.total.toLocaleString()} ₽</p>
            </div>
          </div>
        </div>

        {/* Информация о доставке */}
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="text-xl font-bold mb-6">Информация о доставке</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Package className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium mb-1">{order.deliveryMethod.name}</p>
                <p className="text-sm text-gray-600">{order.deliveryMethod.description}</p>
                {order.deliveryMethod.price > 0 && (
                  <p className="text-sm font-medium mt-1">
                    Стоимость: {order.deliveryMethod.price} ₽
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium mb-1">Получатель</p>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium mb-1">Контактные данные</p>
                <p className="text-sm text-gray-600">{order.shippingAddress.phone}</p>
                <p className="text-sm text-gray-600">{order.shippingAddress.email}</p>
              </div>
            </div>

            <div>
              <p className="font-medium mb-1">Адрес доставки</p>
              <p className="text-sm text-gray-600">{order.shippingAddress.street}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Список товаров */}
      <div className="bg-white rounded-2xl border p-6 mb-12">
        <h2 className="text-xl font-bold mb-6">Состав заказа</h2>

        <div className="space-y-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex items-center justify-between py-4 border-b last:border-0">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Package className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-600">
                    {item.quantity} × {item.price.toLocaleString()} ₽
                  </p>
                </div>
              </div>
              <div className="font-bold">
                {(item.price * item.quantity).toLocaleString()} ₽
              </div>
            </div>
          ))}

          <div className="pt-4 border-t">
            <div className="flex justify-between text-lg font-bold">
              <span>Итого</span>
              <span>{order.total.toLocaleString()} ₽</span>
            </div>
          </div>
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/account/orders">
          <Button size="lg" variant="theme-primary">
            <ShoppingBag className="mr-2 w-5 h-5" />
            Мои заказы
          </Button>
        </Link>

        <Link href="/catalog">
          <Button size="lg" variant="outline">
            Продолжить покупки
          </Button>
        </Link>

        <Link href="/">
          <Button size="lg" variant="ghost">
            <Home className="mr-2 w-5 h-5" />
            На главную
          </Button>
        </Link>
      </div>

      <p className="text-center text-gray-500 mt-8">
        Если у вас есть вопросы по заказу, свяжитесь с нашей службой поддержки
      </p>
    </div>
  );
}
