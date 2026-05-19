import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MessageCircle, Phone, Share2, Truck, Shield, ChevronRight, Package, Clock } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import InquiryModal from '../components/InquiryModal';
import { products, formatPrice } from '../data/products';
import { getWhatsAppLink, getPhoneLink } from '../services/api';

export default function ProductPage() {
  const { id } = useParams();
  const product = products.find(p => p.id === Number(id));
  const [showInquiry, setShowInquiry] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-serif text-3xl text-primary mb-6">Товар не найден</h2>
          <Link to="/catalog" className="btn-primary">В каталог</Link>
        </div>
      </div>
    );
  }

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-black/5">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-4">
          <div className="flex items-center gap-2 text-[11px] text-ash tracking-[0.1em]">
            <Link to="/" className="hover:text-primary no-underline text-ash transition-colors">Главная</Link>
            <ChevronRight size={10} className="text-mist" />
            <Link to="/catalog" className="hover:text-primary no-underline text-ash transition-colors">Каталог</Link>
            <ChevronRight size={10} className="text-mist" />
            <span className="text-primary">{product.brand}</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
          {/* Image */}
          <div className="relative overflow-hidden bg-ivory aspect-square">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            <div className="absolute top-5 left-5 flex gap-2">
              {product.inStock && <span className="badge bg-emerald-600 text-white">В наличии</span>}
              {product.isNew && <span className="badge bg-primary text-white">New</span>}
              {discount > 0 && <span className="badge bg-copper text-white">-{discount}%</span>}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center lg:max-w-lg">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] text-copper font-medium tracking-[0.25em] uppercase">{product.brand}</span>
              <span className="text-black/10">|</span>
              <span className="text-[10px] text-ash tracking-[0.15em]">Арт: {product.article}</span>
            </div>

            <h1 className="font-serif text-xl sm:text-2xl lg:text-4xl text-primary leading-[1.15] mb-5">
              {product.name}
            </h1>

            {/* Stock status */}
            <div className="flex items-center gap-3 mb-8 p-4 bg-ivory">
              {product.inStock ? (
                <>
                  <Package size={16} className="text-emerald-600" />
                  <div>
                    <span className="text-emerald-700 text-[11px] tracking-[0.15em] uppercase font-medium block">В наличии</span>
                    <span className="text-ash text-[11px]">Склад equip.me, Алматы</span>
                  </div>
                </>
              ) : (
                <>
                  <Clock size={16} className="text-amber-500" />
                  <div>
                    <span className="text-amber-700 text-[11px] tracking-[0.15em] uppercase font-medium block">Под заказ</span>
                    <span className="text-ash text-[11px]">Срок поставки 14-21 день</span>
                  </div>
                </>
              )}
            </div>

            {/* Price block */}
            <div className="border-t border-b border-black/5 py-6 mb-6">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-2xl sm:text-3xl font-serif text-primary">{formatPrice(product.price)}</span>
                {product.oldPrice && (
                  <span className="text-base text-mist line-through">{formatPrice(product.oldPrice)}</span>
                )}
              </div>
              <p className="text-[11px] text-ash">Цена может отличаться — уточняйте у менеджера</p>
            </div>

            {/* CTA: WhatsApp + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              <a
                href={getWhatsAppLink(product)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3.5 sm:py-4 bg-[#25D366] text-white text-[11px] font-medium tracking-[0.15em] uppercase hover:bg-[#1ea952] transition-colors no-underline"
              >
                <MessageCircle size={15} /> WhatsApp
              </a>
              <a
                href={getPhoneLink()}
                className="flex items-center justify-center gap-2 py-3.5 sm:py-4 bg-primary text-white text-[11px] font-medium tracking-[0.15em] uppercase hover:bg-charcoal transition-colors no-underline"
              >
                <Phone size={15} /> Позвонить
              </a>
            </div>

            <button
              onClick={() => setShowInquiry(true)}
              className="w-full btn-outline gap-2 py-4 mb-8"
            >
              Оставить заявку на сайте
            </button>

            {/* Info blocks */}
            <div className="space-y-0 border-t border-black/5">
              <div className="flex items-center gap-4 py-4 border-b border-black/5">
                <Truck size={16} className="text-copper shrink-0" strokeWidth={1.5} />
                <span className="text-[13px] text-primary/60">Доставка по Алматы и Казахстану</span>
              </div>
              <div className="flex items-center gap-4 py-4 border-b border-black/5">
                <Shield size={16} className="text-copper shrink-0" strokeWidth={1.5} />
                <span className="text-[13px] text-primary/60">Официальная гарантия производителя</span>
              </div>
              <div className="flex items-center gap-4 py-4">
                <Share2 size={16} className="text-copper shrink-0" strokeWidth={1.5} />
                <span className="text-[13px] text-primary/60">Поставщик: equip.me (склад Алматы)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Specs section */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-px bg-black/5 border border-black/5">
          <div className="bg-white p-8 lg:p-12">
            <h3 className="text-[10px] font-medium tracking-[0.3em] uppercase text-primary mb-6">Описание</h3>
            <p className="text-ash leading-relaxed text-sm">{product.description}</p>
          </div>
          <div className="bg-white p-8 lg:p-12">
            <h3 className="text-[10px] font-medium tracking-[0.3em] uppercase text-primary mb-6">Характеристики</h3>
            {Object.entries(product.specs).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center py-3.5 border-b border-black/5 last:border-0">
                <span className="text-ash text-sm">{key}</span>
                <span className="font-medium text-sm text-primary">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="mt-20 border border-black/5 p-8 lg:p-12">
          <h3 className="text-[10px] font-medium tracking-[0.3em] uppercase text-primary mb-8">Как заказать</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {[
              { step: '01', title: 'Выберите товар', desc: 'Найдите нужное оборудование в каталоге' },
              { step: '02', title: 'Свяжитесь с нами', desc: 'Напишите в WhatsApp или позвоните' },
              { step: '03', title: 'Подтвердите заказ', desc: 'Менеджер уточнит наличие и цену' },
              { step: '04', title: 'Получите товар', desc: 'Доставка со склада equip.me в Алматы' },
            ].map(item => (
              <div key={item.step}>
                <span className="text-[11px] text-copper font-light tracking-[0.3em] block mb-3">{item.step}</span>
                <h4 className="text-sm font-medium text-primary mb-1">{item.title}</h4>
                <p className="text-ash text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-24">
            <div className="flex items-center justify-between mb-12">
              <div>
                <span className="label">Рекомендуем</span>
                <h2 className="section-title mt-3">Похожие товары</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-6 sm:gap-x-5 sm:gap-y-10">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      {/* Inquiry Modal */}
      {showInquiry && (
        <InquiryModal product={product} onClose={() => setShowInquiry(false)} />
      )}
    </div>
  );
}
