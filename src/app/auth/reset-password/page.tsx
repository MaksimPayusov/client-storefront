'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Mail, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useTheme } from '@/hooks/useTheme';

export default function ResetPasswordPage() {
  const { resetPassword, isLoading } = useAuthStore();
  const { theme } = useTheme();

  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError('Введите email');
      return;
    }

    try {
      await resetPassword(email);
      setIsSent(true);
    } catch (error) {
      setError('Ошибка отправки. Попробуйте еще раз.');
    }
  };

  if (isSent) {
    return (
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-black transition-colors">
            Главная
          </Link>
          <span>/</span>
          <span className="text-black font-medium">Сброс пароля</span>
        </div>

        <div className="bg-white rounded-2xl border p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-green-100">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Письмо отправлено!</h1>
          <p className="text-gray-600 mb-6">
            Инструкции по сбросу пароля отправлены на email{' '}
            <span className="font-semibold">{email}</span>
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Проверьте папку «Спам», если письмо не пришло в течение 5 минут
          </p>
          <div className="space-y-3">
            <Link href="/auth/login">
              <Button variant="outline" fullWidth>
                Вернуться к входу
              </Button>
            </Link>
            <Link href="/">
              <Button fullWidth>
                На главную
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-black transition-colors">
          Главная
        </Link>
        <span>/</span>
        <span className="text-black font-medium">Сброс пароля</span>
      </div>

      <div className="bg-white rounded-2xl border p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{
            backgroundColor: `${theme.primaryColor}10`,
            color: theme.primaryColor
          }}>
            <Mail className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Сброс пароля</h1>
          <p className="text-gray-600">
            Введите email, указанный при регистрации
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.ru"
              required
              startIcon={<Mail className="w-4 h-4" />}
            />
          </div>

          <Button
            type="submit"
            variant="theme-primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            disabled={isLoading}
          >
            Отправить инструкции
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-gray-600 mb-4">
            Вспомнили пароль?
          </p>
          <Link href="/auth/login">
            <Button variant="outline" fullWidth>
              Войти
            </Button>
          </Link>
        </div>

        <div className="mt-6 text-xs text-gray-500 text-center">
          После отправки формы проверьте почту для получения инструкций по сбросу пароля
        </div>
      </div>
    </div>
  );
}