import type {
  IGood,
  IGoodCategory,
  IBrand,
  ISize,
  IPaymentMethod,
  IDeliveryMethod,
  IRecipient,
  INews,
  IShop,
} from '@/types';

// КАТЕГОРИИ
export const mockCategories: IGoodCategory[] = [
  {
    id: '1',
    name: 'Женская одежда',
    description: 'Одежда для женщин',
    parentId: null,
  },
  {
    id: '2',
    name: 'Мужская одежда',
    description: 'Одежда для мужчин',
    parentId: null,
  },
  {
    id: '3',
    name: 'Платья',
    description: 'Летние, вечерние, повседневные платья',
    parentId: '1', // Дочерняя от "Женская одежда"
    image: '/images/categories/dresses.svg',
  },
  {
    id: '4',
    name: 'Верхняя одежда',
    description: 'Куртки, пальто, пуховики',
    parentId: '1',
    image: '/images/categories/outerwear.svg',
  },
  {
    id: '5',
    name: 'Джинсы',
    description: 'Разные фасоны джинсов',
    parentId: '2', // Дочерняя от "Мужская одежда"
    image: '/images/categories/jeans.svg',
  },
  {
    id: '6',
    name: 'Футболки',
    description: 'Базовые и принтованные футболки',
    parentId: '2',
    image: '/images/categories/t-shirts.svg',
  },
  {
    id: '7',
    name: 'Куртки',
    description: 'Кожаные, джинсовые, ветровки',
    parentId: '4', // Дочерняя от "Верхняя одежда"
    image: '/images/categories/jackets.svg',
  },
  {
    id: '8',
    name: 'Пальто',
    description: 'Тёплые и лёгкие пальто',
    parentId: '4',
    image: '/images/categories/coats.svg',
  },
]

// БРЕНДЫ
export const mockBrands: IBrand[] = [
  {
    id: '1',
    name: 'Nike',
    description: 'Спортивная одежда и обувь',
    logo: 'https://logos-world.net/wp-content/uploads/2020/04/Nike-Logo.png',
  },
  {
    id: '2',
    name: 'Zara',
    description: 'Испанский бренд быстрой моды',
    logo: 'https://logos-world.net/wp-content/uploads/2020/04/Zara-Logo.png',
  },
  {
    id: '3',
    name: 'Levi\'s',
    description: 'Классические джинсы',
    logo: 'https://logos-world.net/wp-content/uploads/2020/11/Levis-Logo.png',
  },
  {
    id: '4',
    name: 'Adidas',
    description: 'Спортивный стиль',
    logo: 'https://logos-world.net/wp-content/uploads/2020/04/Adidas-Logo.png',
  },
  {
    id: '5',
    name: 'H&M',
    description: 'Доступная мода',
    logo: 'https://logos-world.net/wp-content/uploads/2020/04/HM-Logo.png',
  },
];

// РАЗМЕРЫ
export const mockSizes: ISize[] = [
  { id: 1, title: 'XS', description: 'Extra Small' },
  { id: 2, title: 'S', description: 'Small' },
  { id: 3, title: 'M', description: 'Medium' },
  { id: 4, title: 'L', description: 'Large' },
  { id: 5, title: 'XL', description: 'Extra Large' },
  { id: 6, title: 'XXL', description: 'Double Extra Large' },
];

// ТОВАРЫ
export const mockGoods: IGood[] = [
  {
    id: '1',
    name: 'Черное светское платье',
    description: 'Элегантное черное платье для вечерних мероприятий.',
    price: 5499,
    categoryId: '3', // Платья
    image: '/images/products/dress.svg',
    brand: 'Zara',
    sizes: ['S', 'M', 'L'],
    inStock: true,
  },
  {
    id: '2',
    name: 'Кожаная куртка',
    description: 'Стильная кожаная куртка на молнии.',
    price: 12999,
    categoryId: '7', // Куртки
    image: '/images/products/jacket.svg',
    brand: 'Nike',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
  },
  {
    id: '3',
    name: 'Классические джинсы',
    description: 'Прямые джинсы из денима.',
    price: 3999,
    categoryId: '5', // Джинсы
    image: '/images/products/jeans.svg',
    brand: 'Levi\'s',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
  },
  {
    id: '4',
    name: 'Белая футболка с принтом',
    description: 'Хлопковая футболка с графическим принтом.',
    price: 1499,
    categoryId: '6', // Футболки
    image: '/images/products/tshirt.svg',
    brand: 'Adidas',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
  },
  {
    id: '5',
    name: 'Тёплое зимнее пальто',
    description: 'Утеплённое пальто для холодной погоды.',
    price: 8999,
    categoryId: '8', // Пальто
    image: '/images/products/jacket.svg',
    brand: 'H&M',
    sizes: ['S', 'M', 'L'],
    inStock: true,
  },
  {
    id: '6',
    name: 'Красное вечернее платье',
    description: 'Шелковое платье для особых случаев.',
    price: 8999,
    categoryId: '3', // Платья
    image: '/images/products/dress.svg',
    brand: 'Zara',
    sizes: ['S', 'M'],
    inStock: true,
  }
]

// МЕТОДЫ ОПЛАТЫ
export const mockPaymentMethods: IPaymentMethod[] = [
  {
    id: 1,
    title: 'Банковская карта',
    description: 'Оплата Visa, Mastercard, Мир',
    image: 'https://cdn-icons-png.flaticon.com/512/196/196578.png',
  },
  {
    id: 2,
    title: 'СБП (Сбербанк)',
    description: 'Быстрый платеж через Сбербанк',
    image: 'https://cdn-icons-png.flaticon.com/512/196/196561.png',
  },
  {
    id: 3,
    title: 'ЮMoney',
    description: 'Оплата через ЮMoney',
    image: 'https://cdn-icons-png.flaticon.com/512/196/196565.png',
  },
];

// СПОСОБЫ ДОСТАВКИ
export const mockDeliveryMethods: IDeliveryMethod[] = [
  {
    id: 1,
    title: 'СДЭК',
    description: 'Доставка за 3-5 дней',
    price: 399,
    estimatedDays: 4,
  },
  {
    id: 2,
    title: 'Почта России',
    description: 'Экономичная доставка',
    price: 199,
    estimatedDays: 7,
  },
  {
    id: 3,
    title: 'Самовывоз',
    description: 'Из пункта выдачи в вашем городе',
    price: 0,
    estimatedDays: 1,
  },
];

// ПОЛУЧАТЕЛИ
export const mockRecipients: IRecipient[] = [
  {
    id: '1',
    userId: '1',
    firstName: 'Иван',
    lastName: 'Иванов',
    middleName: 'Иванович',
    address: 'ул. Пушкина, д. 10, кв. 5',
    zipCode: '123456',
    phone: '+7 (999) 123-45-67',
    email: 'ivan@example.com',
    isDefault: true,
  },
  {
    id: '2',
    userId: '1',
    firstName: 'Мария',
    lastName: 'Петрова',
    middleName: 'Сергеевна',
    address: 'пр. Ленина, д. 25, кв. 12',
    zipCode: '654321',
    phone: '+7 (987) 654-32-10',
    email: 'maria@example.com',
    isDefault: false,
  },
];

// НОВОСТИ/БЛОГ
export const mockNews: INews[] = [
  {
    id: '1',
    title: 'Новая весенняя коллекция 2024',
    content: 'Мы рады представить новую весеннюю коллекцию одежды...',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=400&fit=crop',
    publishedAt: new Date('2025-12-18'),
    excerpt: 'Откройте для себя свежие тренды весны',
  },
  {
    id: '2',
    title: 'Скидка 30% на все джинсы',
    content: 'Только до конца месяца специальное предложение...',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=400&fit=crop',
    publishedAt: new Date('2025-12-18'),
    excerpt: 'Не упустите возможность обновить гардероб',
  },
  {
    id: '3',
    title: 'Эко-материалы в нашей одежде',
    content: 'Мы переходим на использование устойчивых материалов...',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&h=400&fit=crop',
    publishedAt: new Date('2025-12-18'),
    excerpt: 'Забота о планете вместе с нами',
  },
];

// МАГАЗИН
export const mockShop: IShop = {
  id: '1',
  name: 'Fashion Store',
  domain: 'fashionstore',
  description: 'Современная одежда для городских жителей',
  coverImage: 'https://images.unsplash.com/photo-1445205170230-053b83016050',
  theme: 'Минимализм',
  categories: ['1', '2', '3', '4', '5', '6', '7', '8'],
  brands: ['Nike', 'Zara', 'Levi\'s', 'Adidas', 'H&M'],
};

// ЭКСПОРТ ДЛЯ УДОБСТВА (если нужен объект со всеми данными)
export const mockData = {
  categories: mockCategories,
  goods: mockGoods,
  brands: mockBrands,
  sizes: mockSizes,
  paymentMethods: mockPaymentMethods,
  deliveryMethods: mockDeliveryMethods,
  recipients: mockRecipients,
  news: mockNews,
  shop: mockShop,
};
