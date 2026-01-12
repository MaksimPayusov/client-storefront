'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Mail, Lock, ArrowRight, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useTheme } from '@/hooks/useTheme';

// Компонент формы с useSearchParams
function LoginFormContent() {
  const router = useRouter();
  const { login, isLoading, error, clearError, isAuthenticated, user } = useAuthStore();
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [redirectPath, setRedirectPath] = useState('/account');

  // Вместо useSearchParams получаем redirect из URL на клиенте
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get('redirect');
      if (redirect) {
        setRedirectPath(redirect);
      }
    }
  }, []);

  // Очищаем ошибки при загрузке компонента
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Слушаем изменения состояния аутентификации
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('Authentication successful, redirecting to:', redirectPath);
      setSuccessMessage('Успешный вход! Перенаправляем...');

      // Даем время для обновления UI
      const timer = setTimeout(() => {
        router.push(redirectPath);
        router.refresh(); // Обновляем страницу для применения middleware
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user, redirectPath, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);

    if (!formData.email || !formData.password) {
      setLocalError('Заполните все поля');
      return;
    }

    try {
      await login(formData.email, formData.password);
      // Редирект произойдет в useEffect при изменении isAuthenticated
    } catch (error) {
      console.error('Login error:', error);
      setLocalError('Ошибка входа. Проверьте данные.');
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (localError) setLocalError(null);
    if (error) clearError();
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Хлебные крошки */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-black transition-colors">
          Главная
        </Link>
        <span>/</span>
        <span className="text-black font-medium">Вход</span>
      </div>

      {/* Форма */}
      <div className="bg-white rounded-2xl border p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{
            backgroundColor: `${theme.primaryColor}10`,
            color: theme.primaryColor
          }}>
            <Mail className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Вход в аккаунт</h1>
          <p className="text-gray-600">
            Введите ваши данные для входа
          </p>
        </div>

        {/* Сообщение об успехе */}
        {successMessage && (
          <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-600 text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            {successMessage}
          </div>
        )}

        {/* Сообщение об ошибке */}
        {(error || localError) && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
            {error || localError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Email
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="example@mail.ru"
              required
              disabled={isLoading}
              startIcon={<Mail className="w-4 h-4" />}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Пароль
            </label>
            <Input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="Введите пароль"
              required
              disabled={isLoading}
              startIcon={<Lock className="w-4 h-4" />}
              endIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Link
              href="/auth/reset-password"
              className="text-sm text-primary hover:underline disabled:opacity-50"
              style={{ color: theme.primaryColor }}
              onClick={(e) => isLoading && e.preventDefault()}
            >
              Забыли пароль?
            </Link>
          </div>

          <Button
            type="submit"
            variant="theme-primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Вход...' : 'Войти'}
            {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-gray-600 mb-4">
            Нет аккаунта?
          </p>
          <Link href="/auth/register">
            <Button
              variant="outline"
              fullWidth
              disabled={isLoading}
            >
              Зарегистрироваться
            </Button>
          </Link>
        </div>

        <div className="mt-6 text-xs text-gray-500 text-center">
          Нажимая на кнопку, вы соглашаетесь с условиями обработки персональных данных
        </div>
      </div>
    </div>
  );
}

// Главный компонент
export default function LoginPage() {
  return <LoginFormContent />;
}