import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';
import InquiryModal from '../components/InquiryModal';

export default function Cart() {
  const { items, removeItem, updateQty, clearCart, total, count } = useCart();
  const [showInquiry, setShowInquiry] = useState(false);

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <ShoppingCart size={48} strokeWidth={1} className="text-mist mb-6" />
        <h2 className="font-serif text-2xl sm:text-3xl text-primary mb-3">Корзина пуста</h2>
        <p className="text-ash text-sm mb-8 text-center">Добавьте товары из каталога, чтобы оформить заявку</p>
        <Link to="/catalog" className="btn-primary">Перейти в каталог</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <div>
            <span className="label">Корзина</span>
            <h1 className="font-serif text-2xl sm:text-4xl text-primary mt-2">
              {count} {count === 1 ? 'товар' : count < 5 ? 'товара' : 'товаров'}
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="text-[11px] text-ash hover:text-primary transition-colors tracking-[0.1em] uppercase"
          >
            Очистить
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
          {/* Items list */}
          <div className="lg:col-span-2 space-y-0 border-t border-black/5">
            {items.map(item => (
              <div key={item.id} className="flex gap-4 sm:gap-6 py-6 border-b border-black/5">
                {/* Image */}
                <Link to={`/product/${item.id}`} className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 bg-white border border-black/5 overflow-hidden block">
                  {item.image
                    ? <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1.5" />
                    : <div className="w-full h-full bg-ivory" />
                  }
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-copper font-medium tracking-[0.2em] uppercase mb-0.5">{item.brand}</p>
                  <Link
                    to={`/product/${item.id}`}
                    className="text-[13px] sm:text-sm text-primary leading-snug mb-1 block no-underline hover:text-copper transition-colors line-clamp-2"
                  >
                    {item.name}
                  </Link>
                  <p className="text-[11px] text-ash mb-3">Арт: {item.article}</p>

                  <div className="flex items-center justify-between gap-3">
                    {/* Qty controls */}
                    <div className="flex items-center border border-black/10">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="w-8 h-8 flex items-center justify-center text-primary hover:bg-ivory transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-[13px] font-medium text-primary">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="w-8 h-8 flex items-center justify-center text-primary hover:bg-ivory transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Price */}
                    <span className="text-sm sm:text-base font-semibold text-primary">{formatPrice(item.price * item.qty)}</span>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="shrink-0 w-8 h-8 flex items-center justify-center text-mist hover:text-primary transition-colors"
                >
                  <Trash2 size={14} strokeWidth={1.5} />
                </button>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="border border-black/5 p-6 sm:p-8 sticky top-24">
              <h2 className="text-[10px] font-medium tracking-[0.3em] uppercase text-primary mb-6">Итого</h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-black/5">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-start gap-2">
                    <span className="text-[12px] text-ash line-clamp-1 flex-1">{item.name}</span>
                    <span className="text-[12px] text-primary shrink-0">× {item.qty}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-baseline mb-8">
                <span className="text-[11px] text-ash tracking-[0.1em] uppercase">Сумма</span>
                <span className="font-serif text-xl sm:text-2xl text-primary">{formatPrice(total)}</span>
              </div>

              <button
                onClick={() => setShowInquiry(true)}
                className="w-full btn-primary mb-3"
              >
                Оформить заявку
              </button>

              <Link to="/catalog" className="w-full flex items-center justify-center gap-2 text-[11px] text-ash hover:text-primary transition-colors tracking-[0.1em] uppercase py-2">
                <ArrowLeft size={12} /> Продолжить покупки
              </Link>

              <p className="text-[11px] text-ash/70 mt-6 text-center leading-relaxed">
                Менеджер свяжется с вами для подтверждения заказа
              </p>
            </div>
          </div>
        </div>
      </div>

      {showInquiry && (
        <InquiryModal
          product={{ name: `Заявка на ${count} ${count === 1 ? 'товар' : 'товара'} на сумму ${formatPrice(total)}`, article: items.map(i => i.article).join(', ') }}
          onClose={() => setShowInquiry(false)}
        />
      )}
    </div>
  );
}
