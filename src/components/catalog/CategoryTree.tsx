'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronRight, Folder, FolderOpen } from 'lucide-react'
import { useShopStore } from '@/store/shop.store'
import { cn } from '@/lib/utils'
import { useTheme } from '@/hooks/useTheme'

interface CategoryTreeProps {
  activeCategoryId?: string
  showRoot?: boolean
  collapsible?: boolean
  className?: string
}

export const CategoryTree: React.FC<CategoryTreeProps> = ({
  activeCategoryId,
  showRoot = false,
  collapsible = false,
  className,
}) => {
  const { getCategoryTree, getChildCategories } = useShopStore()
  const { theme } = useTheme()

  const [collapsed, setCollapsed] = React.useState<Record<string, boolean>>({})

  const categoryTree = getCategoryTree()
  const rootCategories = getChildCategories(null)

  const toggleCollapse = (categoryId: string) => {
    setCollapsed(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }))
  }

  const renderCategory = (category: any, level: number = 0) => {
    const isActive = activeCategoryId === category.id
    const hasChildren = category.children && category.children.length > 0
    const isCollapsed = collapsed[category.id]

    return (
      <div key={category.id} className="mb-1">
        <div className="flex items-center">
          {/* Отступ для уровня вложенности */}
          <div className="flex-shrink-0" style={{ width: level * 24 }} />

          {/* Кнопка раскрытия/сворачивания */}
          {hasChildren && collapsible ? (
            <button
              onClick={() => toggleCollapse(category.id)}
              className="p-1 mr-1 hover:bg-gray-100 rounded"
            >
              <ChevronRight
                className={cn(
                  'w-4 h-4 transition-transform',
                  isCollapsed ? 'rotate-0' : 'rotate-90'
                )}
              />
            </button>
          ) : (
            <div className="w-6" />
          )}

          {/* Иконка категории */}
          <div className="mr-2">
            {hasChildren ? (
              isCollapsed ? (
                <Folder className="w-4 h-4 text-gray-400" />
              ) : (
                <FolderOpen className="w-4 h-4 text-gray-400" />
              )
            ) : (
              <div className="w-4 h-4" />
            )}
          </div>

          {/* Ссылка на категорию */}
          <Link
            href={`/catalog/${category.id}`}
            className={cn(
              'flex-1 py-2 px-3 rounded-lg text-sm transition-colors',
              isActive
                ? 'font-semibold'
                : 'hover:bg-gray-100'
            )}
            style={
              isActive
                ? {
                    backgroundColor: `${theme.primaryColor}10`,
                    color: theme.primaryColor,
                  }
                : {}
            }
          >
            {category.name || category.title}
            {hasChildren && (
              <span className="ml-2 text-xs text-gray-500">
                ({category.children.length})
              </span>
            )}
          </Link>
        </div>

        {/* Дочерние категории */}
        {hasChildren && (!collapsible || !isCollapsed) && (
          <div className="ml-6 mt-1">
            {category.children.map((child: any) =>
              renderCategory(child, level + 1)
            )}
          </div>
        )}
      </div>
    )
  }

  const categoriesToRender = showRoot ? categoryTree : rootCategories

  return (
    <div className={cn('bg-white rounded-xl border p-4', className)}>
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <FolderOpen className="w-4 h-4" />
        Категории
      </h3>

      <div className="max-h-[400px] overflow-y-auto">
        {categoriesToRender.length > 0 ? (
          categoriesToRender.map(category => renderCategory(category))
        ) : (
          <p className="text-gray-500 text-sm py-2">Категорий пока нет</p>
        )}
      </div>
    </div>
  )
}

export default CategoryTree
