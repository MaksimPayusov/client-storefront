// Блок новостей для главной страницы

import Link from 'next/link';

interface NewsBlockProps {
  settings?: {
    limit?: number;
    showExcerpt?: boolean;
  };
  shop?: any;
}

// Временные моковые данные для новостей
const mockNews = [
  {
    id: '1',
    title: 'Новая коллекция весна-лето 2024',
    excerpt: 'Представляем вам нашу новую коллекцию, вдохновленную последними трендами моды.',
    image: null,
  },
  {
    id: '2', 
    title: 'Скидки до 50% на избранные товары',
    excerpt: 'Не упустите возможность приобрести качественные товары по привлекательным ценам.',
    image: null,
  },
  {
    id: '3',
    title: 'Открытие нового магазина',
    excerpt: 'Мы рады сообщить об открытии нашего нового магазина в центре города.',
    image: null,
  },
];

export default function NewsBlock({ 
  settings = {}, 
  shop 
}: NewsBlockProps) {
  const { limit = 3, showExcerpt = true } = settings;
  
  // TODO: Заменить на реальные данные из API
  const news = mockNews.slice(0, limit);
  
  return (
    <section className="mb-16">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Новости</h2>
          <p className="text-gray-600">Самые свежие обновления из мира моды</p>
        </div>
        <Link
          href={`/s/${shop?.shopUrl}/news`}
          className="text-black hover:underline font-medium flex items-center gap-2"
        >
          Все новости
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {news.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((newsItem) => (
            <Link
              key={newsItem.id}
              href={`/s/${shop?.shopUrl}/news/${newsItem.id}`}
              className="group"
            >
              <article className="bg-white rounded-2xl border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="relative h-48 overflow-hidden">
                  {newsItem.image ? (
                    <img
                      src={newsItem.image}
                      alt={newsItem.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                      <div className="w-12 h-12 text-gray-400">📰</div>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {newsItem.title}
                  </h3>
                  {showExcerpt && newsItem.excerpt && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {newsItem.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-primary font-medium group-hover:gap-2 transition-all">
                      Читать
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <div className="w-12 h-12 mx-auto mb-4 text-gray-400">📰</div>
          <p className="text-gray-600">Скоро здесь появятся новости</p>
        </div>
      )}
    </section>
  );
}
