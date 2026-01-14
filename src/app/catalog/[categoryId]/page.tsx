'use client'

import { useParams, useRouter } from 'next/navigation'
import ProductCard from '@/components/shared/ProductCard'
import CategoryTree from '@/components/catalog/CategoryTree'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Home } from 'lucide-react'
import { useShopStore } from '@/store/shop.store'
import Link from 'next/link'

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const categoryId = parseInt(params.categoryId as string)

  const {
    findCategory,
    getChildCategories,
    getGoodsByCategory,
    getCategoryPath
  } = useShopStore()

  const category = findCategory(categoryId)
  const childCategories = getChildCategories(categoryId)
  const categoryGoods = getGoodsByCategory(categoryId, true)
  const categoryPath = getCategoryPath(categoryId)

  // Если категория не найдена, показываем сообщение
  if (!category) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <div className="text-5xl mb-4">😕</div>
        <h1 className="text-2xl font-bold mb-2">Категория не найдена</h1>
        <p className="text-gray-600 mb-6">
          Запрашиваемая категория не существует или была удалена
        </p>
        <Link href="/catalog">
          <Button variant="theme-primary">
            Вернуться в каталог
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Хлебные крошки */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6 flex-wrap">
        <Link href="/" className="hover:text-black flex items-center gap-1">
          <Home className="w-3 h-3" />
          Главная
        </Link>
        <span>/</span>
        <Link href="/catalog" className="hover:text-black">
          Каталог
        </Link>

        {categoryPath.map((cat, index) => (
          <div key={cat.id} className="flex items-center">
            <span>/</span>
            {index === categoryPath.length - 1 ? (
              <span className="text-black font-medium ml-2">{cat.name}</span>
            ) : (
              <Link href={`/catalog/${cat.id}`} className="hover:text-black ml-2">
                {cat.name}
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Заголовок категории */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
            {category.description && (
              <p className="text-gray-600">{category.description}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Link href="/catalog">
              <Button variant="outline">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Назад в каталог
              </Button>
            </Link>
          </div>
        </div>
        <div className="text-gray-600">
          Товаров: {categoryGoods.length}
          {childCategories.length > 0 && ` • Подкатегорий: ${childCategories.length}`}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Сайдбар с деревом категорий */}
        <div className="lg:col-span-1">
          <CategoryTree
            activeCategoryId={categoryId}
            collapsible={true}
            className="sticky top-24"
          />
        </div>

        {/* Основной контент */}
        <div className="lg:col-span-3">
          {/* Подкатегории */}
          {childCategories.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xl font-bold mb-6">Подкатегории</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {childCategories.map(child => (
                  <Link
                    key={child.id}
                    href={`/catalog/${child.id}`}
                    className="group bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors"
                  >
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                      {child.name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {child.description}
                    </p>
                    <div className="mt-3 text-sm text-gray-500">
                      {getGoodsByCategory(child.id, true).length} товаров
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Товары категории */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Товары</h2>
              <div className="text-gray-600 text-sm">
                {categoryGoods.length} товаров
              </div>
            </div>

            {categoryGoods.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryGoods.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={() => alert(`Товар "${product.name}" добавлен в корзину`)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <div className="text-4xl mb-4">😔</div>
                <h3 className="text-xl font-bold mb-2">Товаров пока нет</h3>
                <p className="text-gray-600 mb-6">
                  В этой категории пока нет товаров
                </p>
                <Link href="/catalog">
                  <Button variant="theme-primary">
                    Вернуться в каталог
                  </Button>
                </Link>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
