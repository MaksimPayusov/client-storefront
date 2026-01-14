// Hero блок для главной страницы

interface HeroBlockProps {
  settings?: {
    title?: string;
    subtitle?: string;
    buttonText?: string;
    buttonLink?: string;
    backgroundImage?: string;
  };
  shop?: any;
}

export default function HeroBlock({ 
  settings = {}, 
  shop 
}: HeroBlockProps) {
  const { 
    title = shop?.shopName || 'Добро пожаловать в наш магазин',
    subtitle = shop?.description || 'Откройте для себя мир качественных товаров по доступным ценам',
    buttonText = 'Перейти в каталог',
    buttonLink = `/s/${shop?.shopUrl}/catalog`,
    backgroundImage = shop?.pfpUrl
  } = settings;
  
  return (
    <section className="relative h-96 md:h-[500px] mb-16 rounded-2xl overflow-hidden">
      {/* Фоновое изображение */}
      {backgroundImage ? (
        <img
          src={backgroundImage}
          alt={title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
      )}
      
      {/* Оверлей с текстом */}
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{title}</h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
            {subtitle}
          </p>
          <a
            href={buttonLink}
            className="inline-block px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-colors"
          >
            {buttonText}
          </a>
        </div>
      </div>
    </section>
  );
}
