import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

export default function Cart() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-black/5">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10 lg:py-14">
          <span className="label">Покупки</span>
          <h1 className="font-serif text-3xl lg:text-5xl text-primary tracking-tight mt-2">Корзина</h1>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-28 lg:py-36">
        <div className="text-center max-w-sm mx-auto">
          <div className="w-24 h-24 border border-black/5 flex items-center justify-center mx-auto mb-8">
            <ShoppingBag size={28} className="text-mist" strokeWidth={1.5} />
          </div>
          <h2 className="font-serif text-2xl text-primary mb-3">Корзина пуста</h2>
          <p className="text-ash text-sm mb-10">Добавьте товары из каталога, чтобы оформить заказ</p>
          <Link to="/catalog" className="btn-primary gap-2">
            <ArrowLeft size={14} /> Перейти в каталог
          </Link>
        </div>
      </div>
    </div>
  );
}
