import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Truck, Shield, Package, MessageCircle, Phone, Loader2,
  Coffee, Flame, Snowflake, Wine, Droplets, LayoutGrid, Zap,
  UtensilsCrossed, Wrench, ChevronRight, Waves, Wind, ShoppingCart, Factory, Scale,
  Star, BadgeCheck, Clock,
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { fetchProducts, fetchCategories, fetchBrands, getWhatsAppLink, getPhoneLink } from '../services/api';

const ICON_MAP = {
  Coffee, Flame, Snowflake, Wine, Droplets, LayoutGrid, Zap, UtensilsCrossed,
  Wrench, Package, Waves, Wind, ShoppingCart, Factory, Scale,
  SprayCan: Droplets, Sandwich: UtensilsCrossed,
};

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [hitProducts, setHitProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const catsData = await fetchCategories();
        if (!mounted) return;
        const topCats = catsData.filter(c => c.isTopLevel);
        setCategories(topCats);

        const catIds = topCats.slice(0, 2).map(c => c.id);
        const productResults = await Promise.all(
          catIds.map(id => fetchProducts({ category: id, per_page: 8 }).catch(() => ({ data: [] })))
        );
        if (!mounted) return;
        setHitProducts(productResults.flatMap(r => r.data || []).slice(0, 8));

        const brandResults = await Promise.all(
          topCats.slice(0, 3).map(c => fetchBrands(c.id).catch(() => []))
        );
        if (!mounted) return;
        const allBrands = [...new Set(brandResults.flat())].sort();
        if (allBrands.length > 0) setBrands(allBrands.slice(0, 16));
      } catch (err) {
        console.warn('Home load error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="bg-white">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[420px] sm:min-h-[500px] items-center py-10 sm:py-16">
            {/* Left */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
                Профессиональное<br />
                <span className="text-primary">оборудование</span><br />
                для HoReCa
              </h1>
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 max-w-lg">
                Тепловое, холодильное, барное и кофейное оборудование.
                Склад в Алматы. Доставка по Казахстану.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/catalog" className="btn-primary gap-2 text-sm px-6 py-3">
                  Перейти в каталог <ArrowRight size={15} />
                </Link>
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-[#1ea952] transition-colors no-underline"
                >
                  <MessageCircle size={15} /> WhatsApp
                </a>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 sm:gap-6 mt-8 pt-6 border-t border-gray-200">
                {[
                  { icon: Package, text: '70 000+ позиций' },
                  { icon: Truck, text: 'Доставка по КЗ' },
                  { icon: Shield, text: 'Официальная гарантия' },
                  { icon: Clock, text: 'Ответ за 1 час' },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-2 text-[12px] text-gray-600">
                    <item.icon size={14} className="text-primary shrink-0" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: image */}
            <div className="relative hidden sm:block">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop&q=90"
                  alt="Professional kitchen"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3 border border-gray-100">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <Package size={18} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Сейчас на складе</p>
                  <p className="text-sm font-bold text-gray-900">1 000+ позиций</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BENEFITS BAR ── */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-100">
            {[
              { icon: Truck, title: 'Доставка', desc: 'По Алматы и Казахстану' },
              { icon: BadgeCheck, title: 'Гарантия качества', desc: 'Только оригинальные товары' },
              { icon: Shield, title: 'Гарантия', desc: 'Официальная до 3 лет' },
              { icon: Clock, title: 'Быстрый ответ', desc: 'В течение часа' },
            ].map((item, i) => (
              <div key={item.title} className={`flex items-center gap-3 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 ${i >= 2 ? 'border-t border-gray-100 lg:border-t-0' : ''}`}>
                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                  <item.icon size={17} className="text-primary" />
                </div>
                <div>
                  <h4 className="text-[12px] sm:text-[13px] font-bold text-gray-900">{item.title}</h4>
                  <p className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between mb-5 sm:mb-7">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">Категории</h2>
            <Link to="/catalog" className="text-sm text-primary font-semibold hover:underline flex items-center gap-1 no-underline">
              Все <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-10"><Loader2 size={24} className="animate-spin text-primary" /></div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
              {categories.slice(0, 12).map(cat => {
                const IconComponent = ICON_MAP[cat.icon] || Package;
                return (
                  <Link
                    key={cat.id}
                    to={`/catalog?category=${cat.id}`}
                    className="group bg-gray-50 hover:bg-primary rounded-xl p-3 sm:p-4 flex flex-col items-center gap-2 text-center no-underline transition-all duration-200 border border-transparent hover:border-primary/10 hover:shadow-md"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white group-hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors duration-200 shadow-sm">
                      <IconComponent size={18} className="text-primary group-hover:text-white transition-colors duration-200" strokeWidth={1.75} />
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-semibold text-gray-700 group-hover:text-white leading-tight transition-colors duration-200 line-clamp-2">
                      {cat.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between mb-5 sm:mb-7">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">Популярные товары</h2>
            <Link to="/catalog" className="text-sm text-primary font-semibold hover:underline flex items-center gap-1 no-underline">
              Смотреть все <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-10"><Loader2 size={24} className="animate-spin text-primary" /></div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {hitProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-6 sm:mt-8">
            <Link to="/catalog" className="btn-primary inline-flex gap-2">
              Перейти в каталог <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── BRANDS ── */}
      {brands.length > 0 && (
        <section className="py-8 sm:py-12 bg-white border-t border-gray-100">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-5 sm:mb-7">Бренды</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {brands.map(brand => (
                <Link
                  key={brand}
                  to={`/catalog?brand=${encodeURIComponent(brand)}`}
                  className="bg-gray-50 hover:bg-blue-50 rounded-xl px-3 py-3 text-[11px] sm:text-xs font-semibold text-gray-500 hover:text-primary transition-all text-center truncate no-underline border border-gray-100 hover:border-blue-200"
                >
                  {brand}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── HOW IT WORKS ── */}
      <section className="py-8 sm:py-12 bg-gray-50 border-t border-gray-100">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="relative hidden lg:block rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&h=600&fit=crop"
                alt="Kitchen equipment"
                className="w-full h-[380px] object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6">Как сделать заказ</h2>
              <div className="space-y-4">
                {[
                  { num: '1', title: 'Выберите товар', desc: 'Найдите нужное оборудование в каталоге. Можно воспользоваться поиском.' },
                  { num: '2', title: 'Свяжитесь с нами', desc: 'Напишите в WhatsApp или позвоните — ответим в течение часа.' },
                  { num: '3', title: 'Подтвердите заказ', desc: 'Менеджер уточнит наличие, цену и условия доставки.' },
                  { num: '4', title: 'Получите товар', desc: 'Доставим по Алматы и всему Казахстану.' },
                ].map(item => (
                  <div key={item.num} className="flex gap-4 items-start">
                    <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center font-bold text-sm shrink-0">
                      {item.num}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                      <p className="text-gray-500 text-sm mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 mt-7">
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-[#1ea952] transition-colors no-underline"
                >
                  <MessageCircle size={15} /> Написать в WhatsApp
                </a>
                <a
                  href={getPhoneLink()}
                  className="flex items-center gap-2 border-2 border-gray-200 text-gray-700 px-5 py-2.5 rounded-lg font-bold text-sm hover:border-primary hover:text-primary transition-colors no-underline"
                >
                  <Phone size={15} /> Позвонить
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="py-8 sm:py-12 bg-white border-t border-gray-100">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-5 sm:mb-8 text-center">Почему выбирают нас</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Package, title: 'Широкий каталог', desc: 'Более 70 000 позиций профессионального оборудования для ресторанов, кафе и баров.', color: 'blue' },
              { icon: Clock, title: 'Быстрый ответ', desc: 'Напишите в WhatsApp — менеджер ответит в течение часа и подтвердит наличие.', color: 'green' },
              { icon: Truck, title: 'Доставка и гарантия', desc: 'Доставим по Алматы и Казахстану. Официальная гарантия на всё оборудование.', color: 'purple' },
            ].map(item => (
              <div key={item.title} className="bg-gray-50 rounded-2xl p-5 sm:p-6 border border-gray-100">
                <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <item.icon size={20} className="text-primary" />
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
