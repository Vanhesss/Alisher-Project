import { Link } from 'react-router-dom';
import { MessageCircle, ArrowUpRight } from 'lucide-react';
import { formatPrice } from '../data/products';
import { getWhatsAppLink } from '../services/api';

export default function ProductCard({ product }) {
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  return (
    <div className="group">
      {/* Image */}
      <div className="relative overflow-hidden bg-ivory aspect-[3/4] mb-4 img-zoom">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.inStock && (
            <span className="badge bg-emerald-600 text-white">В наличии</span>
          )}
          {product.isNew && (
            <span className="badge bg-primary text-white">New</span>
          )}
          {discount > 0 && (
            <span className="badge bg-copper text-white">-{discount}%</span>
          )}
        </div>

        {!product.inStock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-[10px] font-medium tracking-[0.25em] uppercase text-primary/70 bg-white/80 px-5 py-2.5">
              Под заказ
            </span>
          </div>
        )}

        {/* Hover actions (always visible on mobile) */}
        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 translate-y-0 sm:translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
          <div className="flex gap-1.5 sm:gap-2">
            <a
              href={getWhatsAppLink(product)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-[#25D366] text-white py-2.5 sm:py-3.5 text-[9px] sm:text-[10px] font-medium tracking-[0.15em] uppercase hover:bg-[#1ea952] transition-colors duration-300 flex items-center justify-center gap-1.5 sm:gap-2 no-underline"
            >
              <MessageCircle size={12} className="sm:w-[13px] sm:h-[13px]" />
              <span className="hidden sm:inline">Узнать цену</span>
              <span className="sm:hidden">Цена</span>
            </a>
            <Link
              to={`/product/${product.id}`}
              className="w-10 sm:w-12 bg-white flex items-center justify-center text-primary hover:bg-ivory transition-colors duration-300"
            >
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div>
        <p className="text-[9px] sm:text-[10px] text-ash font-medium tracking-[0.2em] uppercase mb-1 sm:mb-1.5">
          {product.brand}
        </p>
        <Link
          to={`/product/${product.id}`}
          className="block text-[12px] sm:text-[13px] text-primary leading-snug mb-2 sm:mb-3 no-underline hover:text-copper transition-colors duration-300 line-clamp-2 min-h-[2.2rem] sm:min-h-[2.4rem]"
        >
          {product.name}
        </Link>

        <div className="flex items-baseline gap-1.5 sm:gap-2.5">
          <span className="text-[13px] sm:text-sm font-semibold text-primary">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="text-[10px] sm:text-xs text-mist line-through">{formatPrice(product.oldPrice)}</span>
          )}
        </div>

        {/* Stock indicator */}
        <div className="flex items-center gap-1.5 mt-2">
          <div className={`w-1 h-1 rounded-full ${product.inStock ? 'bg-emerald-500' : 'bg-amber-400'}`} />
          <span className={`text-[10px] tracking-wider ${product.inStock ? 'text-emerald-600' : 'text-amber-600'}`}>
            {product.inStock ? 'Склад Алматы' : 'Под заказ'}
          </span>
        </div>
      </div>
    </div>
  );
}
