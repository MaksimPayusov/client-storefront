'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User, Package, Heart, Settings, LogOut, Mail, Phone, Save } from 'lucide-react';
import { useOrderStore } from '@/store/order.store';
import { useFavoritesStore } from '@/store/favorites.store';
import { useAuthStore } from '@/store/auth.store';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const router = useRouter();
  const { getUserOrders } = useOrderStore();
  const { items } = useFavoritesStore();
  const { user, updateProfile, logout, isLoading, isAuthenticated } = useAuthStore();
  const { theme } = useTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [initialized, setInitialized] = useState(false);

  // Инициализация данных формы при загрузке пользователя
  useEffect(() => {
    if (user) {
      setEditData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
      });
      setInitialized(true);
    }
  }, [user]);

  // Редирект если пользователь не авторизован
  useEffect(() => {
    const checkAuth = () => {
      console.log('Account page auth check:', {
        isAuthenticated,
        user,
        hasUser: !!user,
        token: useAuthStore.getState().token
      });

      if (!isAuthenticated || !user) {
        console.log('Not authenticated, redirecting to login');
        const currentPath = window.location.pathname;
        router.push(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
      }
    };

    // Даем время на инициализацию store
    const timer = setTimeout(() => {
      checkAuth();
    }, 1000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, user, router]);

  const orders = getUserOrders();
  const favoritesCount = items.length;

  const handleSave = async () => {
    try {
      await updateProfile(editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  const handleCancel = () => {
    if (user) {
      setEditData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
    setIsEditing(false);
  };

  // Показываем загрузку пока проверяем авторизацию
  if (!user || !isAuthenticated) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold mb-4">Проверка авторизации...</h1>
          <p className="text-gray-600 mb-6">
            Пожалуйста, подождите
          </p>
        </div>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold mb-2">
              {isEditing ? 'Редактирование профиля' : 'Личный кабинет'}
            </h1>
            <p className="text-gray-600">
              {isEditing
                ? 'Измените ваши данные'
                : 'Управление вашими заказами и настройками'
              }
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
                className={`flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors w-full text-left ${
                  isEditing ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:text-black'
                }`}
                onClick={() => setIsEditing(!isEditing)}
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">
                  {isEditing ? 'Отмена редактирования' : 'Редактировать профиль'}
                </span>
              </button>

              <button
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-red-600 hover:text-red-700 w-full text-left"
                onClick={logout}
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Выйти</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Правая колонка - основное */}
        <div className="md:col-span-2">
          {isEditing ? (
            /* Форма редактирования */
            <div className="bg-white rounded-2xl border p-6">
              <h2 className="text-xl font-bold mb-6">Редактирование профиля</h2>

              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Имя *
                    </label>
                    <Input
                      value={editData.firstName}
                      onChange={(e) => setEditData(prev => ({ ...prev, firstName: e.target.value }))}
                      startIcon={<User className="w-4 h-4" />}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Фамилия *
                    </label>
                    <Input
                      value={editData.lastName}
                      onChange={(e) => setEditData(prev => ({ ...prev, lastName: e.target.value }))}
                      startIcon={<User className="w-4 h-4" />}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email *
                  </label>
                  <Input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                    startIcon={<Mail className="w-4 h-4" />}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Телефон
                  </label>
                  <Input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                    startIcon={<Phone className="w-4 h-4" />}
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="theme-primary"
                    onClick={handleSave}
                    isLoading={isLoading}
                  >
                    <Save className="mr-2 w-4 h-4" />
                    Сохранить изменения
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    Отмена
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            /* Информация о профиле */
            <div className="space-y-6">
              {/* Профиль */}
              <div className="bg-white rounded-2xl border p-6">
                <h2 className="text-xl font-bold mb-6">Профиль</h2>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{
                      backgroundColor: `${theme.primaryColor}20`,
                      color: theme.primaryColor
                    }}>
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="text-gray-600">{user.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>

                    {user.phone && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Телефон</p>
                        <p className="font-medium">{user.phone}</p>
                      </div>
                    )}

                    <div>
                      <p className="text-sm text-gray-600 mb-1">Дата регистрации</p>
                      <p className="font-medium">
                        {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-1">Статус</p>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {user.isVerified ? 'Подтвержден' : 'Не подтвержден'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

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
                <h2 className="text-2xl font-bold mb-4">Добро пожаловать, {user.firstName}!</h2>
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
          )}
        </div>
      </div>
    </div>
  );
}