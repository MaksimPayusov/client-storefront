import React from 'react';
import type { IGood, IGoodCategory, IBasketItem } from '@/types';

const TestTypes: React.FC = () => {
  // Пример использования типов
  const testProduct: IGood = {
    id: 1,
    name: 'Тестовый товар',
    description: 'Описание тестового товара',
    price: 2999,
    categoryId: 1,
    image: 'https://via.placeholder.com/300',
    sizes: ['S', 'M', 'L'],
  };

  const testCategory: IGoodCategory = {
    id: 1,
    name: 'Одежда',
    description: 'Категория одежды',
    parentId: null,
  };

  const testBasketItem: IBasketItem = {
    id: 1,
    goodId: 1,
    count: 2,
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h2 className="text-lg font-bold mb-4">Тест TypeScript типов</h2>
      <div className="space-y-2">
        <p><strong>Товар:</strong> {testProduct.name}</p>
        <p><strong>Категория:</strong> {testCategory.name}</p>
        <p><strong>В корзине:</strong> {testBasketItem.count} шт.</p>
        <p className="text-sm text-green-600 mt-4">
          ✅ Типы успешно импортированы и работают!
        </p>
      </div>
    </div>
  );
};

export default TestTypes;
