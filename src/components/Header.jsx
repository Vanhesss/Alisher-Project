import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu, X, Search, Phone, MessageCircle, Loader2, Package, ShoppingCart,
  ChevronRight, ChevronDown, LayoutGrid, UserCircle, LogOut,
  Coffee, Flame, Snowflake, Wine, Droplets, Zap,
  UtensilsCrossed, Wrench, Waves, Wind, Factory, Scale,
} from 'lucide-react';
import { getPhoneLink, getWhatsAppLink, searchProducts, fetchCategories } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../data/products';
import { useCart } from '../context/CartContext';

const ICON_MAP = {
  Coffee, Flame, Snowflake, Wine, Droplets, LayoutGrid, Zap, UtensilsCrossed,
  Wrench, Package, Waves, Wind, ShoppingCart, Factory, Scale,
  SprayCan: Droplets, Sandwich: UtensilsCrossed,
};

const navLinks = [
  { path: '/about', label: 'О компании' },
  { path: '/delivery', label: 'Доставка' },
  { path: '/contacts', label: 'Контакты' },
];

const POPULAR = ['Пароконвектомат', 'Кофемашина', 'Холодильный шкаф', 'Плита'];

export default function Header() {
  const { count } = useCart();
  const { user, profile, signOut: authSignOut } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);

  // Search
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // Catalog mega-menu
  const [categories, setCategories] = useState([]);
  const [catsLoading, setCatsLoading] = useState(false);
  const [hoveredCat, setHoveredCat] = useState(null);

  // Mobile catalog
  const [mobileExpandedCat, setMobileExpandedCat] = useState(null);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const searchRef = useRef(null);

  const topLevel = categories.filter(c => c.isTopLevel);
  const getChildren = (parentId) => categories.filter(c => c.parentId === parentId);
  const activeCat = categories.find(c => c.id === hoveredCat);
  const activeChildren = hoveredCat ? getChildren(hoveredCat) : [];

  useEffect(() => {
    setMobileOpen(false);
    setCatalogOpen(false);
    setMobileCatOpen(false);
    setQuery('');
    setResults([]);
    setSearchFocused(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Lazy-load categories
  useEffect(() => {
    if (catalogOpen && categories.length === 0 && !catsLoading) {
      setCatsLoading(true);
      fetchCategories().then(cats => {
        setCategories(cats);
        const first = cats.find(c => c.isTopLevel);
        if (first) setHoveredCat(first.id);
        setCatsLoading(false);
      }).catch(() => setCatsLoading(false));
    }
    if (catalogOpen && categories.length > 0 && !hoveredCat) {
      const first = categories.find(c => c.isTopLevel);
      if (first) setHoveredCat(first.id);
    }
  }, [catalogOpen]);

  // Preload categories when mobile menu opens
  useEffect(() => {
    if (mobileOpen && categories.length === 0 && !catsLoading) {
      setCatsLoading(true);
      fetchCategories().then(cats => {
        setCategories(cats);
        setCatsLoading(false);
      }).catch(() => setCatsLoading(false));
    }
  }, [mobileOpen]);

  // Search debounce
  useEffect(() => {
    clearTimeout(timerRef.current);
    if (query.trim().length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    timerRef.current = setTimeout(async () => {
      const data = await searchProducts(query);
      setResults(data);
      setSearching(false);
    }, 350);
    return () => clearTimeout(timerRef.current);
  }, [query]);

  function handleSearchSubmit(e) {
    if (e) e.preventDefault();
    if (query.trim().length >= 2) {
      navigate(`/catalog?search=${encodeURIComponent(query.trim())}`);
      setSearchFocused(false);
      setResults([]);
    }
  }

  function handleCatalogToggle() {
    setCatalogOpen(prev => !prev);
  }

  function goToCategory(catId) {
    navigate(`/catalog?category=${catId}`);
    setCatalogOpen(false);
  }

  const showSearchDropdown = searchFocused && (results.length > 0 || query.trim().length >= 2);

  // Close user menu on outside click
  useEffect(() => {
    function handleClick(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [userMenuOpen]);

  async function handleSignOut() {
    setUserMenuOpen(false);
    await authSignOut();
    navigate('/');
  }

  const displayName = profile?.full_name || user?.email?.split('@')[0] || '';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <>
      {/* ── Top info bar ── */}
      <div className="bg-gray-100 border-b border-gray-200 hidden sm:block">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex items-center justify-between h-8">
          <nav className="flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-[11px] no-underline transition-colors ${
                  location.pathname.startsWith(link.path)
                    ? 'text-primary font-semibold'
                    : 'text-gray-500 hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4 text-[11px] text-gray-500">
            <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="text-[#25D366] hover:text-[#1ea952] no-underline font-medium flex items-center gap-1">
              <MessageCircle size={11} /> WhatsApp
            </a>
            <span className="text-gray-300">|</span>
            <a href={getPhoneLink()} className="hover:text-primary transition-colors no-underline text-gray-500">
              +7 (700) 123-45-67
            </a>
            <span className="text-gray-300">|</span>
            <span>Пн–Пт: 9:00–18:00</span>
          </div>
        </div>
      </div>

      {/* ── Main header ── */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center gap-3 sm:gap-4 h-14 sm:h-16 lg:h-[68px]">

            {/* Mobile burger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center text-gray-600 hover:text-primary transition-colors cursor-pointer shrink-0"
            >
              <Menu size={22} />
            </button>

            {/* Logo */}
            <Link to="/" className="no-underline shrink-0">
              <div className="font-extrabold text-lg sm:text-xl text-primary tracking-tight leading-none">
                PROKITCHEN
              </div>
              <div className="text-[9px] text-gray-400 tracking-[0.2em] uppercase font-medium">
                Professional
              </div>
            </Link>

            {/* Catalog button (desktop) */}
            <button
              onClick={handleCatalogToggle}
              className={`hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm transition-colors cursor-pointer shrink-0 ${
                catalogOpen
                  ? 'bg-primary-dark text-white bg-[#1D4ED8]'
                  : 'bg-primary text-white hover:bg-charcoal'
              }`}
            >
              <LayoutGrid size={15} strokeWidth={2} />
              Каталог
              <ChevronDown size={14} className={`transition-transform duration-200 ${catalogOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Search bar (desktop) */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden lg:flex flex-1 relative max-w-2xl"
            >
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                placeholder="Найти товар по названию или артикулу..."
                className="w-full border border-gray-200 rounded-xl pl-4 pr-14 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 bottom-0 w-12 flex items-center justify-center bg-primary text-white rounded-r-xl hover:bg-charcoal transition-colors"
              >
                {searching
                  ? <Loader2 size={16} className="animate-spin" />
                  : <Search size={16} />
                }
              </button>

              {/* Search dropdown */}
              {showSearchDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                  {results.length > 0 ? (
                    <div className="divide-y divide-gray-50">
                      {results.slice(0, 7).map(product => (
                        <Link
                          key={product.id}
                          to={`/product/${product.id}`}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors no-underline group"
                        >
                          <div className="w-9 h-9 shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                            {product.image
                              ? <img src={product.image} alt={product.name} className="w-full h-full object-contain p-1" />
                              : <Package size={14} className="m-auto mt-2 text-gray-300" />
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] text-gray-800 font-medium truncate group-hover:text-primary transition-colors">{product.name}</p>
                            <p className="text-[10px] text-gray-400">{product.brand}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-[12px] font-bold text-gray-900">{formatPrice(product.price)}</p>
                            {product.inStockAlmaty && <p className="text-[10px] text-green-600">В наличии</p>}
                          </div>
                        </Link>
                      ))}
                      {results.length > 7 && (
                        <button
                          onMouseDown={handleSearchSubmit}
                          className="w-full text-center px-4 py-3 text-[12px] text-primary font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          Показать все {results.length} результатов →
                        </button>
                      )}
                    </div>
                  ) : query.trim().length >= 2 && !searching ? (
                    <div className="px-4 py-4 text-sm text-gray-400">Ничего не найдено по запросу «{query}»</div>
                  ) : searching ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 size={18} className="animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="px-4 py-3">
                      <p className="text-[11px] text-gray-400 mb-2 font-medium">Популярные запросы:</p>
                      <div className="flex flex-wrap gap-2">
                        {POPULAR.map(tag => (
                          <button
                            key={tag}
                            onMouseDown={() => setQuery(tag)}
                            className="text-[11px] px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </form>

            {/* Right icons */}
            <div className="flex items-center gap-1 ml-auto lg:ml-0">
              {/* Mobile search */}
              <button
                onClick={() => navigate('/catalog?search=')}
                className="lg:hidden w-9 h-9 flex items-center justify-center text-gray-500 hover:text-primary transition-colors cursor-pointer"
              >
                <Search size={19} />
              </button>

              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex w-9 h-9 items-center justify-center text-[#25D366] hover:text-[#1ea952] transition-colors"
                title="WhatsApp"
              >
                <MessageCircle size={19} />
              </a>
              <a
                href={getPhoneLink()}
                className="hidden md:flex w-9 h-9 items-center justify-center text-gray-500 hover:text-primary transition-colors"
                title="Позвонить"
              >
                <Phone size={19} />
              </a>
              <Link
                to="/cart"
                className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-primary transition-colors relative"
              >
                <ShoppingCart size={19} />
                {count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                    {count}
                  </span>
                )}
              </Link>
              {/* User account */}
              <div className="relative" ref={userMenuRef}>
                {user ? (
                  <>
                    <button
                      onClick={() => setUserMenuOpen(prev => !prev)}
                      className="w-9 h-9 flex items-center justify-center rounded-full bg-primary text-white font-bold text-[13px] hover:bg-charcoal transition-colors cursor-pointer shrink-0"
                      title={displayName || 'Аккаунт'}
                    >
                      {avatarLetter || <UserCircle size={18} />}
                    </button>
                    {userMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-[12px] font-bold text-gray-900 truncate">{displayName}</p>
                          <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                        </div>
                        <Link
                          to="/account"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-[13px] text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors no-underline"
                        >
                          <UserCircle size={14} /> Личный кабинет
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-[13px] text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <LogOut size={14} /> Выйти
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to="/auth"
                    className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-primary transition-colors"
                    title="Войти"
                  >
                    <UserCircle size={21} />
                  </Link>
                )}
              </div>

              <Link
                to="/contacts"
                className="hidden lg:flex ml-2 bg-primary text-white px-4 py-2 rounded-lg font-bold text-[12px] hover:bg-charcoal transition-colors no-underline"
              >
                Запросить КП
              </Link>
            </div>
          </div>
        </div>

        {/* ── Catalog mega-menu ── */}
        {catalogOpen && (
          <div className="absolute inset-x-0 top-full bg-white border-b border-gray-200 shadow-2xl z-50" style={{ maxHeight: '70vh' }}>
            {catsLoading ? (
              <div className="flex items-center justify-center h-36">
                <Loader2 size={22} className="animate-spin text-primary" />
              </div>
            ) : (
              <div className="max-w-[1440px] mx-auto flex" style={{ maxHeight: '70vh' }}>
                {/* Left: categories list */}
                <div className="w-56 shrink-0 border-r border-gray-100 py-2 overflow-y-auto bg-gray-50">
                  {topLevel.map(cat => {
                    const Icon = ICON_MAP[cat.icon] || Package;
                    const isActive = hoveredCat === cat.id;
                    const hasChildren = getChildren(cat.id).length > 0;
                    return (
                      <button
                        key={cat.id}
                        onMouseEnter={() => setHoveredCat(cat.id)}
                        onClick={() => goToCategory(cat.id)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-[13px] transition-all cursor-pointer text-left group ${
                          isActive
                            ? 'bg-white text-primary font-semibold border-l-2 border-primary'
                            : 'text-gray-600 hover:bg-white hover:text-gray-900'
                        }`}
                      >
                        <Icon size={15} className={`shrink-0 ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'}`} strokeWidth={1.5} />
                        <span className="flex-1 leading-tight">{cat.name}</span>
                        {hasChildren && (
                          <ChevronRight size={12} className={`shrink-0 ${isActive ? 'text-primary' : 'text-gray-300'}`} />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Right: subcategories */}
                <div className="flex-1 overflow-y-auto">
                  {activeCat && (
                    <div className="p-6 lg:p-8">
                      <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900">{activeCat.name}</h3>
                        <button
                          onClick={() => goToCategory(activeCat.id)}
                          className="text-[12px] text-primary font-semibold hover:underline cursor-pointer flex items-center gap-1"
                        >
                          Смотреть все <ChevronRight size={12} />
                        </button>
                      </div>

                      {activeChildren.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1">
                          {activeChildren.map(sub => (
                            <button
                              key={sub.id}
                              onClick={() => goToCategory(sub.id)}
                              className="text-left text-[13px] text-gray-500 hover:text-primary py-2 px-2 transition-colors cursor-pointer leading-tight hover:bg-blue-50 rounded-lg group flex items-center gap-2"
                            >
                              <span className="w-1 h-1 rounded-full bg-gray-300 group-hover:bg-primary transition-colors shrink-0" />
                              {sub.name}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <button
                          onClick={() => goToCategory(activeCat.id)}
                          className="btn-primary text-sm"
                        >
                          Перейти в раздел
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Backdrop */}
      {catalogOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/25"
          onClick={() => setCatalogOpen(false)}
        />
      )}

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[88%] max-w-sm bg-white flex flex-col animate-slide-in overflow-y-auto">

            {/* Header */}
            <div className="flex items-center justify-between px-5 h-14 border-b border-gray-100">
              <span className="font-extrabold text-primary text-lg tracking-tight">PROKITCHEN</span>
              <button onClick={() => setMobileOpen(false)} className="w-10 h-10 flex items-center justify-center text-gray-500 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            {/* Search */}
            <div className="px-5 py-3 border-b border-gray-100">
              <form onSubmit={(e) => { handleSearchSubmit(e); setMobileOpen(false); }} className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Найти товар..."
                  className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                />
              </form>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {/* Catalog expand */}
              <div>
                <button
                  onClick={() => setMobileCatOpen(prev => !prev)}
                  className="w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-bold text-gray-800 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <LayoutGrid size={16} className="text-primary" />
                    Каталог
                  </span>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform ${mobileCatOpen ? 'rotate-180' : ''}`} />
                </button>

                {mobileCatOpen && (
                  <div className="ml-4 mt-1 space-y-0.5">
                    {catsLoading && (
                      <div className="py-3 flex justify-center"><Loader2 size={16} className="animate-spin text-primary" /></div>
                    )}
                    {topLevel.map(cat => {
                      const Icon = ICON_MAP[cat.icon] || Package;
                      const isExpanded = mobileExpandedCat === cat.id;
                      const children = getChildren(cat.id);
                      return (
                        <div key={cat.id}>
                          <button
                            onClick={() => {
                              if (children.length > 0) {
                                setMobileExpandedCat(prev => prev === cat.id ? null : cat.id);
                              } else {
                                goToCategory(cat.id);
                                setMobileOpen(false);
                              }
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
                          >
                            <Icon size={13} className="text-primary/60 shrink-0" strokeWidth={1.5} />
                            <span className="flex-1 text-left">{cat.name}</span>
                            {children.length > 0 && (
                              <ChevronDown size={12} className={`text-gray-300 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            )}
                          </button>
                          {isExpanded && children.length > 0 && (
                            <div className="ml-6 border-l-2 border-gray-100 pl-3 space-y-0.5 mb-1">
                              <button
                                onClick={() => { goToCategory(cat.id); setMobileOpen(false); }}
                                className="w-full text-left text-[12px] text-primary font-semibold py-2 hover:underline cursor-pointer"
                              >
                                Все в категории
                              </button>
                              {children.map(sub => (
                                <button
                                  key={sub.id}
                                  onClick={() => { goToCategory(sub.id); setMobileOpen(false); }}
                                  className="w-full text-left text-[12px] text-gray-500 py-1.5 hover:text-primary transition-colors cursor-pointer leading-tight"
                                >
                                  {sub.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="h-px bg-gray-100 my-2" />

              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium no-underline transition-colors
                    ${location.pathname.startsWith(link.path) ? 'bg-primary/5 text-primary' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile user section */}
            <div className="px-5 py-4 border-t border-gray-100">
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {avatarLetter || <UserCircle size={16} />}
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-gray-900 leading-tight">{displayName}</p>
                      <p className="text-[10px] text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to="/account"
                      onClick={() => setMobileOpen(false)}
                      className="text-[12px] text-primary font-semibold no-underline hover:underline"
                    >
                      Кабинет
                    </Link>
                    <button
                      onClick={() => { setMobileOpen(false); handleSignOut(); }}
                      className="text-red-500 p-1 cursor-pointer"
                      title="Выйти"
                    >
                      <LogOut size={15} />
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-primary text-white py-2.5 rounded-lg font-bold text-sm no-underline hover:bg-charcoal transition-colors"
                >
                  <UserCircle size={16} /> Войти / Зарегистрироваться
                </Link>
              )}
            </div>

            <div className="px-5 py-5 border-t border-gray-100 space-y-3">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#25D366] font-semibold text-sm no-underline"
              >
                <MessageCircle size={16} /> WhatsApp
              </a>
              <a href={getPhoneLink()} className="flex items-center gap-2 text-gray-500 text-sm no-underline">
                <Phone size={16} /> +7 (700) 123-45-67
              </a>
              <p className="text-gray-400 text-xs">Пн — Пт: 9:00 — 18:00</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
