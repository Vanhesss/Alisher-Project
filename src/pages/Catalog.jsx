import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products, categories, brands } from '../data/products';

export default function Catalog() {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [showFilters, setShowFilters] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);

  let filtered = [...products];
  if (selectedCategory) filtered = filtered.filter(p => p.category === selectedCategory);
  if (selectedBrand) filtered = filtered.filter(p => p.brand === selectedBrand);
  if (inStockOnly) filtered = filtered.filter(p => p.inStock);
  if (sortBy === 'price-asc') filtered.sort((a, b) => a.price - b.price);
  if (sortBy === 'price-desc') filtered.sort((a, b) => b.price - a.price);
  if (sortBy === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));

  const activeFilters = [selectedCategory, selectedBrand, inStockOnly].filter(Boolean).length;

  const clearAll = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setInStockOnly(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page header */}
      <div className="border-b border-black/5">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10 lg:py-14">
          <span className="label">Каталог</span>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-5xl text-primary tracking-tight mt-2 leading-tight">Оборудование</h1>
          <p className="text-ash mt-3 text-sm">{filtered.length} {filtered.length === 1 ? 'позиция' : 'позиций'}</p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10 lg:py-14">
        <div className="flex gap-12">
          {/* Sidebar filters */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-28">
              {/* Category */}
              <div className="mb-10">
                <h4 className="text-[10px] font-medium text-primary mb-5 tracking-[0.3em] uppercase">Категория</h4>
                <div className="space-y-0.5">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`w-full text-left text-[13px] px-0 py-2 transition-colors cursor-pointer
                      ${!selectedCategory ? 'text-primary font-medium' : 'text-ash hover:text-primary'}`}
                  >
                    Все категории
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left text-[13px] px-0 py-2 transition-colors cursor-pointer flex justify-between items-center group
                        ${selectedCategory === cat.id ? 'text-primary font-medium' : 'text-ash hover:text-primary'}`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-[11px] text-mist group-hover:text-ash transition-colors">{cat.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-black/5 mb-10" />

              {/* Brand */}
              <div className="mb-10">
                <h4 className="text-[10px] font-medium text-primary mb-5 tracking-[0.3em] uppercase">Бренд</h4>
                <div className="space-y-0.5">
                  <button
                    onClick={() => setSelectedBrand('')}
                    className={`w-full text-left text-[13px] px-0 py-2 transition-colors cursor-pointer
                      ${!selectedBrand ? 'text-primary font-medium' : 'text-ash hover:text-primary'}`}
                  >
                    Все бренды
                  </button>
                  {brands.map(brand => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`w-full text-left text-[13px] px-0 py-2 transition-colors cursor-pointer
                        ${selectedBrand === brand ? 'text-primary font-medium' : 'text-ash hover:text-primary'}`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-black/5 mb-10" />

              {/* In stock */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 border flex items-center justify-center transition-colors ${inStockOnly ? 'bg-primary border-primary' : 'border-mist group-hover:border-primary'}`}>
                  {inStockOnly && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5"/></svg>
                  )}
                </div>
                <span className="text-[13px] text-primary/70">Только в наличии</span>
              </label>

              {activeFilters > 0 && (
                <button onClick={clearAll} className="text-[11px] text-copper hover:text-copper-dark tracking-[0.15em] uppercase mt-6 cursor-pointer transition-colors">
                  Сбросить все
                </button>
              )}
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-black/5">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 text-[11px] font-medium text-primary tracking-[0.15em] uppercase cursor-pointer"
              >
                <SlidersHorizontal size={14} />
                Фильтры
                {activeFilters > 0 && (
                  <span className="w-5 h-5 bg-primary text-white text-[9px] font-bold flex items-center justify-center">{activeFilters}</span>
                )}
              </button>

              <div className="relative ml-auto">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="appearance-none text-[11px] tracking-[0.1em] uppercase border border-black/10 px-5 py-3 pr-10 focus:outline-none focus:border-primary bg-white cursor-pointer text-primary"
                >
                  <option value="default">По умолчанию</option>
                  <option value="price-asc">Цена: по возрастанию</option>
                  <option value="price-desc">Цена: по убыванию</option>
                  <option value="name">По названию</option>
                </select>
                <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-ash pointer-events-none" />
              </div>
            </div>

            {/* Mobile filters */}
            {showFilters && (
              <div className="lg:hidden border border-black/5 p-6 mb-8">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-[11px] font-medium tracking-[0.2em] uppercase text-primary">Фильтры</h3>
                  <button onClick={() => setShowFilters(false)} className="text-ash cursor-pointer hover:text-primary transition-colors"><X size={16} /></button>
                </div>
                <div className="flex flex-wrap gap-2 mb-5">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(selectedCategory === cat.id ? '' : cat.id)}
                      className={`text-[10px] px-4 py-2.5 border transition-colors cursor-pointer tracking-[0.1em] uppercase
                        ${selectedCategory === cat.id ? 'bg-primary text-white border-primary' : 'border-black/10 text-ash hover:text-primary hover:border-primary'}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {brands.map(brand => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(selectedBrand === brand ? '' : brand)}
                      className={`text-[10px] px-4 py-2.5 border transition-colors cursor-pointer tracking-[0.1em] uppercase
                        ${selectedBrand === brand ? 'bg-primary text-white border-primary' : 'border-black/10 text-ash hover:text-primary hover:border-primary'}`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Product grid */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-x-3 gap-y-6 sm:gap-x-5 sm:gap-y-10">
                {filtered.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-28">
                <p className="text-mist text-lg font-light font-serif italic">Ничего не найдено</p>
                <button onClick={clearAll} className="btn-outline mt-8 text-[10px]">
                  Сбросить фильтры
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
