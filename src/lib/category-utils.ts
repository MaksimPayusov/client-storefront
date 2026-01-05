import type { IGoodCategory } from '@/types'

/**
 * Преобразует плоский список категорий в дерево
 */
export function buildCategoryTree(
  categories: IGoodCategory[]
): IGoodCategory[] {
  // Копируем категории, чтобы не мутировать оригинал
  const categoriesCopy = categories.map(cat => ({
    ...cat,
    children: []
  }))

  // Создаём карту для быстрого доступа
  const categoryMap = new Map<number, IGoodCategory>()
  categoriesCopy.forEach(cat => categoryMap.set(cat.id, cat))

  // Собираем дерево
  const tree: IGoodCategory[] = []

  categoriesCopy.forEach(category => {
    if (category.parentId === null) {
      // Корневая категория
      tree.push(category)
    } else {
      // Находим родительскую категорию
      const parent = categoryMap.get(category.parentId)
      if (parent && parent.children) {
        parent.children.push(category)
      }
    }
  })

  // Добавляем уровень вложенности
  function addLevels(categories: IGoodCategory[], level: number = 0) {
    categories.forEach(cat => {
      cat.level = level
      if (cat.children && cat.children.length > 0) {
        addLevels(cat.children, level + 1)
      }
    })
  }

  addLevels(tree)
  return tree
}

/**
 * Находит категорию по ID в дереве
 */
export function findCategoryInTree(
  tree: IGoodCategory[],
  id: number
): IGoodCategory | undefined {
  for (const category of tree) {
    if (category.id === id) return category

    if (category.children && category.children.length > 0) {
      const found = findCategoryInTree(category.children, id)
      if (found) return found
    }
  }
  return undefined
}

/**
 * Получает путь к категории (цепочка родительских категорий)
 */
export function getCategoryPath(
  tree: IGoodCategory[],
  categoryId: number,
  allCategories: IGoodCategory[] // Добавляем параметр
): IGoodCategory[] {
  const category = findCategoryInTree(tree, categoryId)
  if (!category) return []

  const path: IGoodCategory[] = [category]

  // Рекурсивно находим родителей
  function findParents(catId: number) {
    // Ищем родителя в дереве
    let parentId: number | null = null

    // Проверяем в плоском списке
    const cat = allCategories.find(c => c.id === catId)
    if (cat) {
      parentId = cat.parentId
    }

    if (parentId) {
      const parentCategory = findCategoryInTree(tree, parentId)
      if (parentCategory) {
        path.unshift(parentCategory)
        findParents(parentCategory.id)
      }
    }
  }

  findParents(categoryId)
  return path
}

/**
 * Получает все дочерние категории (включая вложенные)
 */
export function getAllChildCategories(
  tree: IGoodCategory[],
  parentId: number
): IGoodCategory[] {
  const parent = findCategoryInTree(tree, parentId)
  if (!parent) return []

  const children: IGoodCategory[] = []

  function collectChildren(category: IGoodCategory) {
    if (category.children) {
      category.children.forEach(child => {
        children.push(child)
        collectChildren(child)
      })
    }
  }

  collectChildren(parent)
  return children
}

/**
 * Получает все товары категории и её подкатегорий
 */
export function getGoodsInCategoryAndChildren(
  goods: any[], // IGood[]
  categories: IGoodCategory[],
  categoryId: number
): any[] {
  const categoryTree = buildCategoryTree(categories)
  const childCategories = getAllChildCategories(categoryTree, categoryId)
  const allCategoryIds = [categoryId, ...childCategories.map(c => c.id)]

  return goods.filter(good =>
    allCategoryIds.includes(good.categoryId)
  )
}