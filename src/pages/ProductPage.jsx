import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MessageCircle, Phone, Share2, Truck, Shield, ChevronRight, Package, Clock, Loader2, Printer, ShoppingCart, FileDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import InquiryModal from '../components/InquiryModal';
import { formatPrice } from '../data/products';
import { fetchProduct, fetchProducts, fetchCategories, getWhatsAppLink, getPhoneLink } from '../services/api';
import { useCart } from '../context/CartContext';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInquiry, setShowInquiry] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [categoryName, setCategoryName] = useState('');
  const { addItem } = useCart();

  useEffect(() => {
    setLoading(true);
    setProduct(null);
    setActiveImg(0);
    setCategoryName('');
    window.scrollTo(0, 0);

    fetchProduct(id).then(p => {
      setProduct(p);
      setLoading(false);

      if (p && p.category) {
        fetchProducts({ category: p.category, per_page: 5 }).then(result => {
          setRelated((result.data || []).filter(r => r.id !== p.id).slice(0, 4));
        });
        fetchCategories().then(cats => {
          const match = cats.find(c => String(c.id) === String(p.category) || c.id === p.category);
          if (match) setCategoryName(match.name || match.title || '');
        });
      }
    });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-copper" />
      </div>
    );
  }

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

  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-black/5">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-3 sm:py-4">
          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-ash tracking-[0.1em]">
            <Link to="/" className="hover:text-primary no-underline text-ash transition-colors">Главная</Link>
            <ChevronRight size={10} className="text-mist shrink-0" />
            <Link to="/catalog" className="hover:text-primary no-underline text-ash transition-colors">Каталог</Link>
            {categoryName && (
              <>
                <ChevronRight size={10} className="text-mist shrink-0" />
                <Link to={`/catalog?category=${product.category}`} className="hover:text-primary no-underline text-ash transition-colors truncate max-w-[120px] sm:max-w-none">{categoryName}</Link>
              </>
            )}
            <ChevronRight size={10} className="text-mist shrink-0" />
            <span className="text-primary truncate">{product.name.length > 30 ? product.name.slice(0, 30) + '…' : product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-20">
          {/* Image Gallery */}
          <div>
            <div className="relative overflow-hidden bg-white border border-black/5 aspect-square">
              <img
                src={product.images?.[activeImg] || product.image}
                alt={product.name}
                className="w-full h-full object-contain p-4"
              />
              <div className="absolute top-3 left-3 sm:top-5 sm:left-5 flex gap-1.5 sm:gap-2">
                {product.isNew && <span className="badge bg-primary text-white text-[8px] sm:text-[9px]">New</span>}
                {discount > 0 && <span className="badge bg-copper text-white text-[8px] sm:text-[9px]">-{discount}%</span>}
              </div>
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto scroll-x-hidden">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 border overflow-hidden bg-white transition-all ${
                      activeImg === i ? 'border-primary' : 'border-black/10 hover:border-black/30'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center lg:max-w-lg">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <span className="text-[9px] sm:text-[10px] text-copper font-medium tracking-[0.2em] sm:tracking-[0.25em] uppercase">{product.brand}</span>
              <span className="text-black/10">|</span>
              <span className="text-[9px] sm:text-[10px] text-ash tracking-[0.1em] sm:tracking-[0.15em]">Арт: {product.article}</span>
            </div>

            <h1 className="font-serif text-lg sm:text-2xl lg:text-4xl text-primary leading-[1.15] mb-4 sm:mb-5">
              {product.name}
            </h1>

            {/* Stock status */}
            <div className="flex items-center gap-3 mb-5 sm:mb-8 p-3 sm:p-4 bg-ivory">
              {product.inStock ? (
                <>
                  <Package size={16} className="text-emerald-600" />
                  <div>
                    <span className="text-emerald-700 text-[11px] tracking-[0.15em] uppercase font-medium block">В наличии</span>
                    <span className="text-ash text-[11px]">{product.inStockAlmaty ? 'Склад в Алматы' : 'Есть в наличии'}{product.stockQuantity ? ` · ${product.stockQuantity} шт.` : ''}</span>
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
            <div className="border-t border-b border-black/5 py-4 sm:py-6 mb-4 sm:mb-6">
              <div className="flex items-baseline gap-2 sm:gap-3 mb-1">
                <span className="text-xl sm:text-3xl font-serif text-primary">{formatPrice(product.price)}</span>
                {product.oldPrice && (
                  <span className="text-base text-mist line-through">{formatPrice(product.oldPrice)}</span>
                )}
              </div>
              <p className="text-[11px] text-ash">Цена может отличаться — уточняйте у менеджера</p>
            </div>

            {/* CTA: WhatsApp + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 no-print">
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
              onClick={() => addItem(product)}
              className="w-full flex items-center justify-center gap-2 py-3.5 sm:py-4 bg-primary text-white text-[11px] font-medium tracking-[0.15em] uppercase hover:bg-charcoal transition-colors mb-3 no-print"
            >
              <ShoppingCart size={15} /> В корзину
            </button>

            <button
              onClick={() => setShowInquiry(true)}
              className="w-full btn-outline gap-2 py-4 mb-4 no-print"
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
              <div className="flex items-center gap-4 py-4 border-b border-black/5">
                <Share2 size={16} className="text-copper shrink-0" strokeWidth={1.5} />
                <span className="text-[13px] text-primary/60">Склад в Алматы, Казахстан</span>
              </div>
              <div className="flex items-center gap-4 py-4 no-print">
                <Printer size={16} className="text-copper shrink-0" strokeWidth={1.5} />
                <button
                  onClick={() => window.print()}
                  className="text-[13px] text-primary/60 hover:text-primary transition-colors cursor-pointer"
                >
                  Печать / PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Specs section */}
        {(product.description || Object.keys(product.specs || {}).length > 0) && (
          <div className="mt-10 sm:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-px bg-black/5 border border-black/5">
            {product.description && (
              <div className="bg-white p-5 sm:p-8 lg:p-12">
                <h3 className="text-[10px] font-medium tracking-[0.3em] uppercase text-primary mb-4 sm:mb-6">Описание</h3>
                <p className="text-ash leading-relaxed text-xs sm:text-sm whitespace-pre-line">{product.description}</p>
              </div>
            )}
            {Object.keys(product.specs || {}).length > 0 && (
              <div className="bg-white p-5 sm:p-8 lg:p-12">
                <h3 className="text-[10px] font-medium tracking-[0.3em] uppercase text-primary mb-4 sm:mb-6">Характеристики</h3>
                {Object.entries(product.specs || {}).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center gap-3 py-2.5 sm:py-3.5 border-b border-black/5 last:border-0">
                    <span className="text-ash text-xs sm:text-sm">{key}</span>
                    <span className="font-medium text-xs sm:text-sm text-primary text-right">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Downloadable files */}
        {product.files && product.files.length > 0 && (
          <div className="mt-10 sm:mt-16 border border-black/5 p-5 sm:p-8 lg:p-12">
            <h3 className="text-[10px] font-medium tracking-[0.3em] uppercase text-primary mb-6">Файлы для скачивания</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {product.files.map((file, i) => (
                <a
                  key={i}
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 border border-black/8 hover:border-primary/30 hover:bg-ivory transition-all no-underline group"
                >
                  <FileDown size={18} className="text-copper shrink-0" strokeWidth={1.5} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-primary group-hover:text-copper transition-colors truncate">{file.name}</p>
                    <p className="text-[10px] text-ash uppercase tracking-[0.1em]">
                      {file.ext?.toUpperCase() || 'PDF'}
                      {file.size ? ` · ${file.size > 1048576 ? (file.size / 1048576).toFixed(1) + ' МБ' : Math.round(file.size / 1024) + ' КБ'}` : ''}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* How it works */}
        <div className="mt-10 sm:mt-20 border border-black/5 p-5 sm:p-8 lg:p-12">
          <h3 className="text-[10px] font-medium tracking-[0.3em] uppercase text-primary mb-8">Как заказать</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {[
              { step: '01', title: 'Выберите товар', desc: 'Найдите нужное оборудование в каталоге' },
              { step: '02', title: 'Свяжитесь с нами', desc: 'Напишите в WhatsApp или позвоните' },
              { step: '03', title: 'Подтвердите заказ', desc: 'Менеджер уточнит наличие и цену' },
              { step: '04', title: 'Получите товар', desc: 'Доставка со склада в Алматы' },
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
          <div className="mt-12 sm:mt-24 no-print">
            <div className="flex items-center justify-between mb-8 sm:mb-12">
              <div>
                <span className="label">Рекомендуем</span>
                <h2 className="section-title mt-3">Похожие товары</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-2.5 gap-y-5 sm:gap-x-5 sm:gap-y-10">
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
