'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowLeft, Check, CreditCard, Truck, Home, Package } from 'lucide-react';
import { useOrderStore } from '@/store/order.store';
import { useShopStore } from '@/store/shop.store';
import { useCartStore } from '@/store/cart.store';
import { YandexDeliveryWidget } from '@/components/delivery/YandexDeliveryWidget';
import { useAuthStore } from '@/store/auth.store';
import { orderService } from '@/services/orders.service';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { goods, shop } = useShopStore();
  const { deliveryMethods, paymentMethods, createOrder } = useOrderStore();
  const { user } = useAuthStore();

  const { items: cartItems, clearCart } = useCartStore();

  // Форма получателя
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    comment: '',
  });

  const [selectedDelivery, setSelectedDelivery] = useState(deliveryMethods[0]?.id.toString() || '1');
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0]?.id.toString() || '1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedPickupPoint, setSelectedPickupPoint] = useState<any>(null);
  const selectedDeliveryMethod = deliveryMethods.find((method) => method.id.toString() === selectedDelivery);

  // Получаем товары из корзины
  const cartProducts = cartItems.map(item => {
    const product = goods.find(p => p.id === item.productId);
    return {
      ...item,
      product,
      price: product?.price || 0,
      name: product?.name || 'Товар',
      image: product?.image,
    };
  }).filter(item => item.product);

  // Расчеты
  const subtotal = cartProducts.reduce((sum, item) =>
    sum + (item.price * item.quantity), 0
  );

  const deliveryMethod = deliveryMethods.find(d => d.id.toString() === selectedDelivery);
  const paymentMethod = paymentMethods.find(p => p.id.toString() === selectedPayment);

  useEffect(() => {
    if (deliveryMethods.length && !selectedDeliveryMethod) {
      setSelectedDelivery(deliveryMethods[0].id.toString());
    }
  }, [deliveryMethods, selectedDeliveryMethod]);

  useEffect(() => {
    if (paymentMethods.length && !paymentMethod) {
      setSelectedPayment(paymentMethods[0].id.toString());
    }
  }, [paymentMethods, paymentMethod]);
  const deliveryPrice = deliveryMethod?.price || 0;
  const total = subtotal + deliveryPrice;

  // Валидация
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'Введите имя';
    if (!formData.lastName.trim()) newErrors.lastName = 'Введите фамилию';
    if (!formData.phone.trim()) newErrors.phone = 'Введите телефон';
    if (!formData.email.trim()) newErrors.email = 'Введите email';
    if (!formData.address.trim()) newErrors.address = 'Введите адрес';

    // Простая валидация email
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный email';
    }

    // Простая валидация телефона
    if (formData.phone && !/^[\d\s\-\+\(\)]{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Некорректный телефон';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Оформление заказа
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Пожалуйста, исправьте ошибки в форме');
      return;
    }

    setIsSubmitting(true);

    try {
      if (!user?.id) {
        alert('Для оформления заказа необходимо войти в аккаунт');
        return;
      }

      if (!shop?.id) {
        alert('Не удалось определить магазин для заказа');
        return;
      }

      // Создаем заказ
      const order = await createOrder({
        recipientId: user.id,
        items: cartProducts.map(item => ({
          productId: item.productId,
          shopId: item.product?.shopId || shop.id,
          quantity: item.quantity,
          pricePerItem: item.price,
        })),
        deliveryMethodId: selectedDelivery.toString(),
        paymentMethodId: selectedPayment.toString(),
        yandexDelivery: selectedPickupPoint
          ? {
              pickupPointId: selectedPickupPoint.id,
              pickupPointAddress: selectedPickupPoint.address,
              pickupPointName: selectedPickupPoint.name,
              latitude: selectedPickupPoint.latitude,
              longitude: selectedPickupPoint.longitude,
              deliveryPrice: selectedPickupPoint.price,
              deliveryTerm: selectedPickupPoint.deliveryTerm,
              pickupPointType: selectedPickupPoint.type,
              workSchedule: selectedPickupPoint.schedule,
              phone: selectedPickupPoint.phone,
            }
          : undefined,
      });

      clearCart();

      // Если выбрана онлайн-оплата — создаем платеж YooKassa и редиректим на оплату
      const paymentName = paymentMethod?.name?.toLowerCase() || '';
      const isOnlinePayment =
        paymentName.includes('online') ||
        paymentName.includes('card') ||
        paymentName.includes('yookassa');

      if (isOnlinePayment) {
        const amountValue = typeof (order as any).totalAmount === 'number'
          ? (order as any).totalAmount
          : total;
        const amount = amountValue.toFixed(2);
        const returnUrl = `${window.location.origin}/checkout/success?orderId=${order.id}`;

        const paymentResponse = await orderService.createYooKassaPayment({
          amount,
          currency: 'RUB',
          description: `Оплата заказа ${order.id}`,
          orderId: order.id,
          returnUrl,
        });

        const confirmationUrl =
          paymentResponse?.confirmation?.confirmationUrl ||
          paymentResponse?.confirmation?.confirmation_url;
        if (confirmationUrl) {
          window.location.href = confirmationUrl;
          return;
        }
      }

      // Редирект на страницу успеха
      router.push(`/checkout/success?orderId=${order.id}`);

    } catch (error) {
      console.error('Ошибка оформления заказа:', error);
      alert('Произошла ошибка при оформлении заказа');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Очищаем ошибку при вводе
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Хлебные крошки */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-black transition-colors">
          Главная
        </Link>
        <span>/</span>
        <Link href="/cart" className="hover:text-black transition-colors">
          Корзина
        </Link>
        <span>/</span>
        <span className="text-black font-medium">Оформление заказа</span>
      </div>

      <h1 className="text-3xl font-bold mb-8">Оформление заказа</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Левая колонка - форма */}
        <div className="lg:col-span-2 space-y-8">
          {/* Получатель */}
          <section className="bg-white rounded-2xl border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Home className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold">Данные получателя</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Имя *
                </label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Иван"
                  error={errors.firstName}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Фамилия *
                </label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Иванов"
                  error={errors.lastName}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Телефон *
                </label>
                <Input
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+7 (999) 123-45-67"
                  error={errors.phone}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email *
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="ivan@example.com"
                  error={errors.email}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Адрес доставки *
                </label>
                <Input
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="г. Екатеринбург, ул. Мира, д. 10, кв. 5"
                  error={errors.address}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Комментарий к заказу (необязательно)
                </label>
                <Input
                  value={formData.comment}
                  onChange={(e) => handleInputChange('comment', e.target.value)}
                  placeholder="Например, позвонить перед доставкой"
                />
              </div>
            </div>
          </section>

          {/* Доставка */}
          <section className="bg-white rounded-2xl border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Truck className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-bold">Способ доставки</h2>
            </div>

            <div className="space-y-3">
              {deliveryMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
                    selectedDelivery === method.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value={method.id.toString()}
                    checked={selectedDelivery === method.id.toString()}
                    onChange={(e) => setSelectedDelivery(e.target.value)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{method.name}</h3>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                      <div className="font-bold">
                        {method.price === 0 ? 'Бесплатно' : `${method.price} ₽`}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {/* Виджет Яндекс.Доставки для выбора ПВЗ */}
            {(selectedDeliveryMethod?.id === 'yandex' ||
              selectedDeliveryMethod?.name?.toLowerCase().includes('yandex') ||
              selectedDeliveryMethod?.name?.toLowerCase().includes('яндекс')) && (
              <div className="mt-6">
                <h3 className="font-semibold mb-4">Выберите пункт выдачи на карте:</h3>
                <YandexDeliveryWidget
                  city={formData.address.split(',')[0]?.trim() || 'Москва'}
                  onSelectPoint={(point) => {
                    console.log('Выбран пункт выдачи:', point);
                    setSelectedPickupPoint(point);
                  }}
                />
              </div>
            )}
          </section>

          {/* Оплата */}
          <section className="bg-white rounded-2xl border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold">Способ оплаты</h2>
            </div>

            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
                    selectedPayment === method.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id.toString()}
                    checked={selectedPayment === method.id.toString()}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{method.name}</h3>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Правая колонка - итоги */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Корзина */}
            <div className="bg-white rounded-2xl border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-amber-600" />
                </div>
                <h2 className="text-xl font-bold">Ваш заказ</h2>
              </div>

              <div className="space-y-4 mb-6">
                {cartProducts.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.quantity} × {item.price.toLocaleString()} ₽
                      </p>
                    </div>
                    <p className="font-bold">
                      {(item.price * item.quantity).toLocaleString()} ₽
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Товары ({cartProducts.length})</span>
                  <span>{subtotal.toLocaleString()} ₽</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Доставка</span>
                  <span>{deliveryPrice === 0 ? 'Бесплатно' : `${deliveryPrice} ₽`}</span>
                </div>

                <div className="flex justify-between text-lg font-bold border-t pt-3">
                  <span>Итого</span>
                  <span>{total.toLocaleString()} ₽</span>
                </div>
              </div>
            </div>

            {/* Кнопки */}
            <div className="space-y-4">
              <Button
                type="submit"
                size="lg"
                fullWidth
                disabled={isSubmitting || cartProducts.length === 0}
                className="h-14 text-lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Оформляем...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 w-5 h-5" />
                    Подтвердить заказ
                  </>
                )}
              </Button>

              <Link href="/cart">
                <Button variant="outline" fullWidth>
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Вернуться в корзину
                </Button>
              </Link>

              <p className="text-xs text-gray-500 text-center">
                Нажимая на кнопку, вы соглашаетесь с условиями обработки персональных данных
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
