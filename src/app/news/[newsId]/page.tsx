'use client';

import React from 'react';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { useShopStore } from '@/store/shop.store';
import { getSafeImageUrl } from '@/lib/utils';

export default function NewsItemPage() {
  const params = useParams();
  const newsId = parseInt(params.newsId as string);

  const { news } = useShopStore();
  const newsItem = news.find(item => item.id === newsId);

  if (!newsItem) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Кнопка назад */}
      <div className="mb-8">
        <Link href="/news">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Все новости
          </Button>
        </Link>
      </div>

      {/* Заголовок */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {newsItem.title}
        </h1>
      </div>

      {/* Главное изображение */}
      {newsItem.image && (
        <div className="relative h-[400px] rounded-2xl overflow-hidden mb-8">
          <Image
            src={getSafeImageUrl(newsItem.image)}
            alt={newsItem.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Содержимое статьи */}
      <article className="prose prose-lg max-w-none mb-12">
        <div className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
          {newsItem.content || newsItem.excerpt || 'Содержимое статьи скоро будет добавлено...'}
        </div>
      </article>

      {/* Похожие новости */}
      <div className="mt-16 pt-8 border-t">
        <h2 className="text-2xl font-bold mb-6">Другие новости</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news
            .filter(item => item.id !== newsItem.id)
            .slice(0, 3)
            .map(related => (
              <Link
                key={related.id}
                href={`/news/${related.id}`}
                className="group"
              >
                <div className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-40 bg-gray-100 relative overflow-hidden">
                    {related.image ? (
                      <Image
                        src={getSafeImageUrl(related.image)}
                        alt={related.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 text-gray-400">📰</div>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {related.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}