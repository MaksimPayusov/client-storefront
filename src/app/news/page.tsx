'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Newspaper, Home } from 'lucide-react';
import { useShopStore } from '@/store/shop.store';
import { getSafeImageUrl, cn } from '@/lib/utils';

export default function NewsPage() {
  const { news } = useShopStore();

  return (
    <div>
      {/* Хлебные крошки */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-black transition-colors flex items-center gap-1">
          <Home className="w-3 h-3" />
          Главная
        </Link>
        <span>/</span>
        <span className="text-black font-medium">Новости</span>
      </div>

      {/* Заголовок */}
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Newspaper className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Новости</h1>
            <p className="text-gray-600">
              Самые свежие обновления из мира моды
            </p>
          </div>
        </div>
        <div className="text-gray-600">
          Всего статей: {news.length}
        </div>
      </div>

      {/* Список новостей */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Главная новость (первая) */}
        {news.length > 0 && (
          <div className="lg:col-span-2">
            <div className="group relative overflow-hidden rounded-2xl bg-gray-900 text-white">
              <div className="absolute inset-0">
                {news[0].image ? (
                  <Image
                    src={getSafeImageUrl(news[0].image)}
                    alt={news[0].title}
                    fill
                    className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              </div>

              <div className="relative p-8 h-[400px] flex flex-col justify-end">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                    Главная новость
                  </span>
                </div>
                <h2 className="text-3xl font-bold mb-4 group-hover:text-gray-200 transition-colors">
                  {news[0].title}
                </h2>
                {news[0].excerpt && (
                  <p className="text-gray-300 mb-6 line-clamp-2">
                    {news[0].excerpt}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <Link href={`/news/${news[0].id}`}>
                    <Button
                      variant="outline"
                      className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                    >
                      Читать
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Боковая панель (остальные новости) */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border p-6">
            <h3 className="font-bold text-lg mb-6">Последние новости</h3>
            <div className="space-y-6">
              {news.slice(1, 4).map(item => (
                <Link
                  key={item.id}
                  href={`/news/${item.id}`}
                  className="group block"
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      {item.image ? (
                        <Image
                          src={getSafeImageUrl(item.image)}
                          alt={item.title}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full group-hover:scale-110 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Newspaper className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1 group-hover:text-primary transition-colors line-clamp-2">
                        {item.title}
                      </h4>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Все остальные новости */}
      {news.length > 1 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-8">Все новости</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.slice(1).map(item => (
              <article
                key={item.id}
                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <Link href={`/news/${item.id}`}>
                  {/* Изображение */}
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    {item.image ? (
                      <Image
                        src={getSafeImageUrl(item.image)}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Newspaper className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Контент */}
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </h3>

                    {item.excerpt && (
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {item.excerpt}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1 text-primary font-medium group-hover:gap-2 transition-all">
                        Читать
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Если нет новостей */}
      {news.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <Newspaper className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-bold mb-2">Новостей пока нет</h3>
          <p className="text-gray-600 mb-6">
            Следите за обновлениями, скоро здесь появятся интересные статьи
          </p>
          <Link href="/">
            <Button variant="theme-primary">
              На главную
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}