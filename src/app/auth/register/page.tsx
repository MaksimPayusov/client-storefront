'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useTheme } from '@/hooks/useTheme';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error } = useAuthStore();
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    // Валидация
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.firstName || !formData.lastName) {
      setLocalError('Заполните обязательные поля');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Пароли не совпадают');
      return;
    }

    if (formData.password.length < 6) {
      setLocalError('Пароль должен содержать минимум 6 символов');
      return;
    }

    try {
      await register(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        formData.phone || undefined
      );
      router.push('/account');
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (localError) setLocalError(null);
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Хлебные крошки */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-black transition-colors">
          Главная
        </Link>
        <span>/</span>
        <span className="text-black font-medium">Регистрация</span>
      </div>

      {/* Форма */}
      <div className="bg-white rounded-2xl border p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{
            backgroundColor: `${theme.primaryColor}10`,
            color: theme.primaryColor
          }}>
            <User className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Создание аккаунта</h1>
          <p className="text-gray-600">
            Заполните форму для регистрации
          </p>
        </div>

        {(error || localError) && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
            {error || localError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Имя *
              </label>
              <Input
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                placeholder="Иван"
                required
                startIcon={<User className="w-4 h-4" />}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Фамилия *
              </label>
              <Input
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                placeholder="Иванов"
                required
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
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="example@mail.ru"
              required
              startIcon={<Mail className="w-4 h-4" />}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Телефон (необязательно)
            </label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+7 (999) 123-45-67"
              startIcon={<Phone className="w-4 h-4" />}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Пароль *
            </label>
            <Input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="Минимум 6 символов"
              required
              startIcon={<Lock className="w-4 h-4" />}
              endIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Подтверждение пароля *
            </label>
            <Input
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              placeholder="Повторите пароль"
              required
              startIcon={<Lock className="w-4 h-4" />}
              endIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />
          </div>

          <div className="text-xs text-gray-500">
            Нажимая на кнопку, вы соглашаетесь с условиями обработки персональных данных
          </div>

          <Button
            type="submit"
            variant="theme-primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            disabled={isLoading}
          >
            Зарегистрироваться
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-gray-600 mb-4">
            Уже есть аккаунт?
          </p>
          <Link href="/auth/login">
            <Button variant="outline" fullWidth>
              Войти
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}