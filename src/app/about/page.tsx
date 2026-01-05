export default function AboutPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">О компании</h1>
      <div className="prose max-w-none">
        <p className="text-lg mb-6">
          FashionStore — это современный интернет-магазин одежды, который предлагает
          широкий ассортимент качественной одежды для всей семьи.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold mb-4">Наша миссия</h2>
            <p>
              Мы стремимся сделать моду доступной для каждого, предлагая стильную и
              качественную одежду по справедливым ценам.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">Наши ценности</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Качество продукции</li>
              <li>Честные цены</li>
              <li>Отличный сервис</li>
              <li>Быстрая доставка</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}