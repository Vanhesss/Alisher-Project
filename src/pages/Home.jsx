import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Truck, Shield, Headphones, Package, CheckCircle2, MessageCircle, Phone } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import { products, categories, brands } from '../data/products';
import { getWhatsAppLink, getPhoneLink } from '../services/api';

export default function Home() {
  const hitProducts = products.filter(p => p.isHit);
  const newProducts = products.filter(p => p.isNew);
  const inStockCount = products.filter(p => p.inStock).length;

  return (
    <div>
      {/* ──── HERO ──── */}
      <section className="relative min-h-[85vh] sm:min-h-[95vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="https://videos.pexels.com/video-files/8428490/8428490-hd_2048_1080_25fps.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12 py-32 w-full">
          <div className="max-w-3xl">
            <div className="overflow-hidden mb-6">
              <span className="block text-[10px] font-medium tracking-[0.4em] uppercase text-copper-light opacity-0 animate-fade-up">
                Официальный партнёр equip.me · Склад Алматы
              </span>
            </div>

            <div className="overflow-hidden">
              <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-[5.5rem] text-white leading-[1.05] tracking-tight opacity-0 animate-fade-up delay-200">
                Профессиональное<br />
                оборудование<br />
                <em className="text-copper-light">в наличии</em>
              </h1>
            </div>

            <div className="overflow-hidden mt-8">
              <p className="text-white/50 text-base lg:text-lg leading-relaxed max-w-lg opacity-0 animate-fade-up delay-300">
                Тепловое, холодильное, барное и кофейное оборудование
                со склада в Алматы. Напишите — подберём и доставим.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 mt-10 opacity-0 animate-fade-up delay-400">
              <Link to="/catalog" className="btn-copper gap-2">
                Смотреть каталог <ArrowRight size={14} />
              </Link>
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white px-6 py-3.5 sm:px-8 sm:py-4 font-medium text-[11px] tracking-[0.2em] uppercase inline-flex items-center justify-center gap-2 hover:bg-[#1ea952] transition-colors no-underline"
              >
                <MessageCircle size={14} /> WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Bottom stats bar */}
        <div className="absolute bottom-0 inset-x-0 border-t border-white/10">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/10">
              {[
                { value: `${inStockCount}+`, label: 'Товаров в наличии' },
                { value: '1', label: 'Склад в Алматы' },
                { value: '50+', label: 'Мировых брендов' },
                { value: '24ч', label: 'Ответ менеджера' },
              ].map((stat, i) => (
                <div key={stat.label} className={`py-4 sm:py-6 lg:py-8 ${i > 0 ? 'pl-4 sm:pl-6 lg:pl-10' : ''} ${i >= 2 ? 'border-t border-white/10 sm:border-t-0' : ''} opacity-0 animate-fade-up`} style={{ animationDelay: `${0.5 + i * 0.1}s` }}>
                  <div className="text-lg sm:text-xl lg:text-2xl font-serif text-white mb-1">{stat.value}</div>
                  <div className="text-[9px] sm:text-[10px] text-white/30 tracking-[0.15em] uppercase">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ──── HOW IT WORKS ──── */}
      <section className="bg-ivory border-b border-black/5">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:divide-x divide-black/5">
            {[
              { icon: Package, title: 'Наличие на складе', desc: 'Оборудование equip.me в Алматы' },
              { icon: MessageCircle, title: 'Заявка', desc: 'WhatsApp или звонок' },
              { icon: Shield, title: 'Гарантия', desc: 'Официальная до 3 лет' },
              { icon: Truck, title: 'Доставка', desc: 'По Алматы и Казахстану' },
            ].map(adv => (
              <div key={adv.title} className="flex items-center gap-4 py-4 sm:py-7 lg:py-8 px-5 lg:px-8 border-b sm:border-b-0 border-black/5 last:border-b-0">
                <adv.icon size={20} className="text-copper shrink-0" strokeWidth={1.5} />
                <div>
                  <h4 className="text-[13px] font-medium text-primary">{adv.title}</h4>
                  <p className="text-[11px] text-ash mt-0.5">{adv.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── CATEGORIES ──── */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex items-end justify-between mb-12 lg:mb-16">
            <div>
              <span className="label">Каталог</span>
              <h2 className="section-title mt-3">
                Категории<br className="hidden sm:block" /> оборудования
              </h2>
            </div>
            <Link to="/catalog" className="btn-ghost hidden sm:flex">
              Все категории <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
            {categories.slice(0, 3).map((cat, i) => (
              <CategoryCard key={cat.id} category={cat} large={i === 0} />
            ))}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 mt-3 lg:mt-4">
            {categories.slice(3, 6).map(cat => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* ──── BESTSELLERS (In Stock) ──── */}
      <section className="py-20 lg:py-28 bg-ivory relative noise-bg">
        <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex items-end justify-between mb-12 lg:mb-16">
            <div>
              <span className="label">В наличии на складе</span>
              <h2 className="section-title mt-3">Популярное</h2>
            </div>
            <Link to="/catalog" className="btn-ghost hidden sm:flex">
              Все товары <ArrowRight size={13} />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-6 sm:gap-x-5 sm:gap-y-10">
            {hitProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ──── EDITORIAL: How it works ──── */}
      <section className="bg-white">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
            <div className="relative overflow-hidden img-zoom">
              <img
                src="https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=900&h=1100&fit=crop"
                alt="Professional kitchen"
                className="w-full h-full object-cover min-h-[50vh]"
              />
            </div>

            <div className="flex flex-col justify-center px-6 sm:px-8 lg:px-20 py-12 sm:py-16 lg:py-24">
              <span className="label">Как это работает</span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-5xl text-primary mt-4 mb-8 leading-[1.15]">
                От заявки до<br />
                <em className="text-copper">доставки</em>
              </h2>
              <p className="text-ash leading-relaxed text-sm mb-10 max-w-md">
                Мы работаем напрямую со складом equip.me в Алматы. Вы выбираете — мы доставляем.
                Никаких сложных форм и онлайн-оплат. Просто напишите нам.
              </p>
              <ul className="space-y-5 mb-10">
                {[
                  { num: '01', text: 'Выберите оборудование в каталоге' },
                  { num: '02', text: 'Напишите в WhatsApp или позвоните' },
                  { num: '03', text: 'Менеджер подтвердит наличие и цену' },
                  { num: '04', text: 'Доставка со склада equip.me' },
                ].map(item => (
                  <li key={item.num} className="flex items-start gap-4">
                    <span className="text-[11px] text-copper tracking-[0.2em] font-light mt-0.5 shrink-0">{item.num}</span>
                    <span className="text-sm text-primary/70">{item.text}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3">
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] text-white px-6 py-3.5 text-[11px] font-medium tracking-[0.15em] uppercase inline-flex items-center gap-2 hover:bg-[#1ea952] transition-colors no-underline"
                >
                  <MessageCircle size={14} /> Написать в WhatsApp
                </a>
                <a href={getPhoneLink()} className="btn-outline gap-2 py-3.5">
                  <Phone size={14} /> Позвонить
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──── NEW ARRIVALS ──── */}
      <section className="py-20 lg:py-28 bg-white border-t border-black/5">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex items-end justify-between mb-12 lg:mb-16">
            <div>
              <span className="label">Свежие поставки</span>
              <h2 className="section-title mt-3">Новинки на складе</h2>
            </div>
            <Link to="/catalog" className="btn-ghost hidden sm:flex">
              Все новинки <ArrowRight size={13} />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-6 sm:gap-x-5 sm:gap-y-10">
            {newProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ──── BRANDS ──── */}
      <section className="py-20 lg:py-28 bg-ivory border-t border-black/5 relative noise-bg">
        <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12 text-center">
          <span className="label">Бренды на складе equip.me</span>
          <h2 className="section-title mt-3">Наши бренды</h2>
          <p className="section-subtitle mx-auto">Оригинальное оборудование от официальных дистрибьюторов</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-black/5 mt-14 border border-black/5">
            {brands.map(brand => (
              <div
                key={brand}
                className="bg-white px-8 py-8 text-base font-light text-mist
                           hover:text-primary transition-all duration-500 cursor-pointer tracking-[0.1em]
                           flex items-center justify-center group"
              >
                <span className="group-hover:scale-110 transition-transform duration-500">{brand}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── WHY US ──── */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4">
              <span className="label">Почему мы</span>
              <h2 className="section-title mt-3">
                Простой способ<br />купить оборудование
              </h2>
              <div className="w-12 h-px bg-copper mt-6" />
            </div>
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/5">
                {[
                  { num: '01', title: 'Всё в наличии', desc: 'Работаем со складом equip.me в Алматы. Вы видите только то, что реально есть в наличии.' },
                  { num: '02', title: 'Быстрый ответ', desc: 'Напишите в WhatsApp — менеджер ответит в течение часа и подтвердит наличие и цену.' },
                  { num: '03', title: 'Доставка и гарантия', desc: 'Доставим по Алматы и Казахстану. Официальная гарантия на всё оборудование.' },
                ].map(item => (
                  <div key={item.num} className="bg-white p-8 lg:p-10 group">
                    <span className="text-[11px] text-copper font-light tracking-[0.3em] block mb-8">{item.num}</span>
                    <h3 className="text-lg font-serif text-primary mb-4">{item.title}</h3>
                    <div className="w-6 h-px bg-black/10 mb-4 group-hover:w-10 group-hover:bg-copper transition-all duration-500" />
                    <p className="text-ash leading-relaxed text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
