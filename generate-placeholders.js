// generate-placeholders.js
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'public/images/products');

// Создаем простые SVG-изображения разных цветов
const placeholders = [
  { name: 'dress', color: '#9ca3af', text: 'Платье' },
  { name: 'jacket', color: '#6b7280', text: 'Куртка' },
  { name: 'jeans', color: '#4b5563', text: 'Джинсы' },
  { name: 'tshirt', color: '#374151', text: 'Футболка' },
  { name: 'bag', color: '#1f2937', text: 'Сумка' },
  { name: 'shoes', color: '#111827', text: 'Обувь' },
];

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

placeholders.forEach(({ name, color, text }) => {
  const svg = `<svg width="600" height="900" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${color}"/>
    <text x="50%" y="50%" font-family="Arial" font-size="48" fill="white"
          text-anchor="middle" dy=".3em">${text}</text>
  </svg>`;

  fs.writeFileSync(path.join(imagesDir, `${name}.svg`), svg);
  console.log(`Created: ${name}.svg`);
});

console.log('✅ All placeholder images generated!');