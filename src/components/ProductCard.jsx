import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, MessageCircle, Heart } from 'lucide-react';
import { formatPrice } from '../data/products';
import { getWhatsAppLink } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { user, toggleFavorite, isFavorite } = useAuth();
  const navigate = useNavigate();
  const fav = isFavorite(product.id);

  function handleFavorite(e) {
    e.preventDefault();
    if (!user) { navigate('/auth'); return; }
    toggleFavorite(product);
  }
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-[0_6px_24px_rgba(0,0,0,0.1)] transition-shadow duration-300 flex flex-col group">
      {/* Image */}
      <Link
        to={`/product/${product.id}`}
        className="relative block bg-gray-50 overflow-hidden"
        style={{ aspectRatio: '1' }}
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-3 sm:p-4 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <ShoppingCart size={32} />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              -{discount}%
            </span>
          )}
          {product.isNew && (
            <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              Новинка
            </span>
          )}
        </div>

        {/* Favorite */}
        <button
          onClick={handleFavorite}
          className={`absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full transition-all cursor-pointer ${
            fav
              ? 'bg-red-50 text-red-500'
              : 'bg-white/80 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-400'
          }`}
          title={fav ? 'Убрать из избранного' : 'В избранное'}
        >
          <Heart size={13} fill={fav ? 'currentColor' : 'none'} />
        </button>
      </Link>

      {/* Content */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 gap-2">
        {/* Brand */}
        {product.brand && (
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide truncate">
            {product.brand}
          </p>
        )}

        {/* Name */}
        <Link
          to={`/product/${product.id}`}
          className="block text-[12px] sm:text-[13px] text-gray-800 font-medium leading-snug no-underline hover:text-primary transition-colors line-clamp-3 flex-1"
        >
          {product.name}
        </Link>

        {/* Stock */}
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full shrink-0 ${product.inStock ? 'bg-green-500' : 'bg-gray-300'}`} />
          <span className={`text-[11px] font-medium ${product.inStock ? 'text-green-600' : 'text-gray-400'}`}>
            {product.inStock
              ? `В наличии${product.stockQuantity ? ` · ${product.stockQuantity} шт.` : ''}`
              : 'Под заказ'}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-base sm:text-lg font-bold text-gray-900 leading-none">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-1">
          <button
            onClick={(e) => { e.preventDefault(); addItem(product); }}
            className="flex-1 bg-primary text-white py-2 rounded-lg font-bold text-xs sm:text-sm hover:bg-charcoal transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ShoppingCart size={13} />
            В корзину
          </button>
          <a
            href={getWhatsAppLink(product)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 sm:w-10 flex items-center justify-center bg-[#25D366] text-white rounded-lg hover:bg-[#1ea952] transition-colors no-underline shrink-0"
          >
            <MessageCircle size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
