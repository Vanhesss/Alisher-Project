import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, Phone, MessageCircle } from 'lucide-react';
import { getPhoneLink, getWhatsAppLink } from '../services/api';

const navLinks = [
  { path: '/catalog', label: 'Каталог' },
  { path: '/about', label: 'О компании' },
  { path: '/delivery', label: 'Доставка' },
  { path: '/contacts', label: 'Контакты' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-primary text-white text-[10px] tracking-[0.25em] uppercase font-medium">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex items-center justify-center h-9 gap-6">
          <span className="opacity-60">Оборудование в наличии на складе Алматы</span>
          <span className="opacity-20 hidden sm:inline">|</span>
          <span className="opacity-60 hidden sm:inline">Поставщик equip.me</span>
          <span className="opacity-20 hidden sm:inline">|</span>
          <a href={getPhoneLink()} className="text-white opacity-80 hover:opacity-100 transition-opacity no-underline hidden sm:inline">
            +7 (700) 123-45-67
          </a>
        </div>
      </div>

      {/* Main header */}
      <header className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/98 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.06)]'
          : 'bg-white'
      }`}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">
            {/* Left: burger + nav */}
            <div className="flex items-center gap-8">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center text-primary cursor-pointer"
              >
                <Menu size={20} strokeWidth={1.5} />
              </button>

              <nav className="hidden lg:flex items-center gap-8">
                {navLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-[11px] font-medium tracking-[0.15em] uppercase no-underline transition-all duration-300 relative
                      ${location.pathname.startsWith(link.path)
                        ? 'text-primary'
                        : 'text-ash hover:text-primary'}`}
                  >
                    {link.label}
                    {location.pathname.startsWith(link.path) && (
                      <span className="absolute -bottom-1 left-0 w-full h-px bg-primary" />
                    )}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Center: logo */}
            <Link to="/" className="no-underline absolute left-1/2 -translate-x-1/2">
              <span className="text-lg lg:text-xl font-serif font-semibold text-primary tracking-[0.08em]">
                PROKITCHEN
              </span>
            </Link>

            {/* Right: actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-10 h-10 flex items-center justify-center text-primary/60 hover:text-primary transition-colors cursor-pointer"
              >
                <Search size={18} strokeWidth={1.5} />
              </button>
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex w-10 h-10 items-center justify-center text-[#25D366] hover:text-[#1ea952] transition-colors"
                title="WhatsApp"
              >
                <MessageCircle size={18} strokeWidth={1.5} />
              </a>
              <a
                href={getPhoneLink()}
                className="hidden sm:flex w-10 h-10 items-center justify-center text-primary/60 hover:text-primary transition-colors"
                title="Позвонить"
              >
                <Phone size={18} strokeWidth={1.5} />
              </a>
              <div className="hidden lg:block w-px h-5 bg-black/10 mx-2" />
              <Link to="/contacts" className="hidden lg:flex bg-primary text-white px-5 py-2.5 text-[10px] font-medium tracking-[0.15em] uppercase hover:bg-charcoal transition-colors no-underline">
                Запросить КП
              </Link>
            </div>
          </div>
        </div>

        <div className="h-px bg-black/5" />

        {/* Search overlay */}
        {searchOpen && (
          <div className="absolute inset-x-0 top-full bg-white border-b border-black/5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)]">
            <div className="max-w-2xl mx-auto px-6 py-10">
              <div className="relative">
                <Search size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-mist" strokeWidth={1.5} />
                <input
                  type="text"
                  placeholder="Поиск оборудования на складе..."
                  className="w-full border-b border-black/10 focus:border-primary bg-transparent text-lg font-light py-3 pl-8 pr-12 focus:outline-none transition-colors placeholder:text-mist font-sans"
                  autoFocus
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-ash hover:text-primary cursor-pointer transition-colors"
                >
                  <X size={18} strokeWidth={1.5} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3 mt-6">
                {['Пароконвектомат', 'Кофемашина', 'Холодильный шкаф', 'Плита'].map(tag => (
                  <button key={tag} className="text-[10px] text-ash hover:text-primary transition-colors cursor-pointer tracking-[0.15em] uppercase px-3 sm:px-4 py-2 border border-black/8 hover:border-primary/30">
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm bg-white flex flex-col animate-slide-in">
            <div className="flex items-center justify-between px-8 h-16 border-b border-black/5">
              <span className="font-serif font-semibold text-primary tracking-[0.08em]">PROKITCHEN</span>
              <button onClick={() => setMobileOpen(false)} className="w-10 h-10 flex items-center justify-center cursor-pointer text-primary">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
            <nav className="flex-1 flex flex-col px-8 pt-10 gap-1">
              {navLinks.map((link, i) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`text-2xl font-light no-underline py-4 border-b border-black/5 transition-colors opacity-0 animate-fade-up
                    ${location.pathname.startsWith(link.path) ? 'text-primary' : 'text-ash hover:text-primary'}`}
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="px-8 pb-10 space-y-4">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#25D366] text-sm no-underline font-medium"
              >
                <MessageCircle size={16} /> Написать в WhatsApp
              </a>
              <a href={getPhoneLink()} className="flex items-center gap-2 text-ash text-sm no-underline">
                <Phone size={16} /> +7 (700) 123-45-67
              </a>
              <p className="text-mist text-xs">Пн — Пт: 9:00 — 18:00</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
