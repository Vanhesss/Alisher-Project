import { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  SlidersHorizontal, X, ChevronDown, ChevronLeft, ChevronRight, Loader2, Package,
  Coffee, Flame, Snowflake, Wine, Droplets, LayoutGrid, Zap, UtensilsCrossed,
  Wrench, Search, Waves, Wind, ShoppingCart, Factory, Scale, ChevronUp, ArrowRight,
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { fetchProducts, fetchCategories, fetchBrands, searchProducts } from '../services/api';

const ICON_MAP = {
  Coffee, Flame, Snowflake, Wine, Droplets, LayoutGrid, Zap, UtensilsCrossed,
  Wrench, Package, Waves, Wind, ShoppingCart, Factory, Scale,
  SprayCan: Droplets, Sandwich: UtensilsCrossed,
};

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const initialSearch = searchParams.get('search') || '';
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const searchTimer = useRef(null);
  const [sortBy, setSortBy] = useState('default');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedParent, setExpandedParent] = useState(null);
  const [page, setPage] = useState(1);

  const [products, setProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [catLoading, setCatLoading] = useState(true);

  // Global search (no category selected)
  const [globalResults, setGlobalResults] = useState([]);
  const [globalLoading, setGlobalLoading] = useState(false);
  const globalSearchRef = useRef(null);

  // Build category tree from flat list
  const topLevel = useMemo(() => allCategories.filter(c => c.isTopLevel), [allCategories]);
  const getChildren = (parentId) => allCategories.filter(c => c.parentId === parentId);

  // Lock body scroll when mobile filters open
  useEffect(() => {
    document.body.style.overflow = showFilters ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showFilters]);

  useEffect(() => {
    fetchCategories().then(cats => {
      setAllCategories(cats);
      setCatLoading(false);
    });
  }, []);

  // When categories load, expand the parent of the current selected category
  useEffect(() => {
    if (!selectedCategory || allCategories.length === 0) return;
    const cat = allCategories.find(c => String(c.id) === String(selectedCategory));
    if (cat) {
      if (cat.isTopLevel) {
        setExpandedParent(cat.id);
      } else if (cat.parentId) {
        setExpandedParent(cat.parentId);
      }
    }
  }, [allCategories, selectedCategory]);

  useEffect(() => {
    if (!selectedCategory) { setBrands([]); return; }
    // Fetch brands from the top-level parent for better brand coverage
    const cat = allCategories.find(c => String(c.id) === String(selectedCategory));
    const parentId = cat?.isTopLevel ? selectedCategory : cat?.parentId;
    const brandCatId = parentId || selectedCategory;
    fetchBrands(brandCatId).then(b => setBrands(b)).catch(() => {});
  }, [selectedCategory, allCategories]);

  useEffect(() => {
    if (!selectedCategory) {
      setProducts([]); setTotal(0); setTotalPages(1); setLoading(false);
      return;
    }
    setLoading(true);
    fetchProducts({
      category: selectedCategory,
      brand: selectedBrand,
      search: searchQuery || undefined,
      sort: sortBy === 'default' ? undefined : sortBy,
      page,
      per_page: 24,
      in_stock: stockFilter === 'in_stock' ? true : undefined,
    }).then(result => {
      let items = result.data || [];
      if (stockFilter === 'to_order') items = items.filter(p => !p.inStock);
      setProducts(items);
      setTotal(result.total || 0);
      setTotalPages(result.totalPages || 1);
      setLoading(false);
    });
  }, [selectedCategory, selectedBrand, sortBy, stockFilter, page, searchQuery]);

  useEffect(() => { setPage(1); }, [selectedCategory, selectedBrand, sortBy, stockFilter, searchQuery]);

  useEffect(() => {
    const params = {};
    if (selectedCategory) params.category = selectedCategory;
    if (!selectedCategory && searchQuery) params.search = searchQuery;
    setSearchParams(params, { replace: true });
  }, [selectedCategory, searchQuery]);

  // Global search when no category is selected
  useEffect(() => {
    if (selectedCategory || !searchQuery || searchQuery.trim().length < 2) {
      setGlobalResults([]);
      return;
    }
    clearTimeout(globalSearchRef.current);
    setGlobalLoading(true);
    globalSearchRef.current = setTimeout(async () => {
      const results = await searchProducts(searchQuery);
      setGlobalResults(results);
      setGlobalLoading(false);
    }, 400);
    return () => clearTimeout(globalSearchRef.current);
  }, [selectedCategory, searchQuery]);

  const activeFilters = [selectedBrand, stockFilter !== 'all' ? stockFilter : '', searchQuery].filter(Boolean).length;
  const clearAll = () => { setSelectedBrand(''); setStockFilter('all'); setSearchQuery(''); setSearchInput(''); };

  function handleSearchChange(e) {
    const val = e.target.value;
    setSearchInput(val);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setSearchQuery(val), 400);
  }

  function handleParentClick(catId) {
    const children = getChildren(catId);
    if (expandedParent === catId) {
      // Clicking the already-expanded parent: collapse but keep selected
    } else {
      setExpandedParent(catId);
    }
    setSelectedCategory(String(catId));
    setSelectedBrand('');
    setStockFilter('all');
    setSearchInput('');
    setSearchQuery('');
  }

  function handleSubClick(subId) {
    setSelectedCategory(String(subId));
    setSelectedBrand('');
    setStockFilter('all');
  }

  const selectedCat = allCategories.find(c => String(c.id) === String(selectedCategory));
  const selectedCatName = selectedCat?.name || '';
  const isSubSelected = selectedCat && !selectedCat.isTopLevel;
  const parentCat = isSubSelected ? allCategories.find(c => c.id === selectedCat.parentId) : selectedCat;

  // Sidebar category list (shared between desktop and mobile)
  function CategoryList({ onClose }) {
    return (
      <div className="space-y-0.5">
        {catLoading ? (
          <div className="py-4 text-ash text-xs px-3">Загрузка...</div>
        ) : topLevel.map(cat => {
          const Icon = ICON_MAP[cat.icon] || Package;
          const isExpanded = expandedParent === cat.id;
          const isParentActive = String(selectedCategory) === String(cat.id) ||
            (isSubSelected && selectedCat.parentId === cat.id);
          const children = getChildren(cat.id);

          return (
            <div key={cat.id}>
              <button
                onClick={() => { handleParentClick(cat.id); if (onClose && children.length === 0) onClose(); }}
                className={`w-full text-left text-[12px] px-3 py-2.5 transition-all cursor-pointer flex items-center gap-2.5 border-l-2 group
                  ${isParentActive
                    ? 'text-primary font-medium border-copper bg-ivory/60'
                    : 'text-ash hover:text-primary border-transparent hover:border-black/10'
                  }`}
              >
                <Icon size={14} className={isParentActive ? 'text-copper shrink-0' : 'text-ash/40 shrink-0 group-hover:text-ash/60'} strokeWidth={1.5} />
                <span className="flex-1 leading-tight">{cat.name}</span>
                {children.length > 0 && (
                  isExpanded
                    ? <ChevronUp size={12} className="text-ash/50 shrink-0" />
                    : <ChevronDown size={12} className="text-ash/50 shrink-0" />
                )}
              </button>

              {/* Subcategories */}
              {isExpanded && children.length > 0 && (
                <div className="ml-6 mb-1 space-y-0.5 border-l border-black/6 pl-3">
                  {children.map(sub => {
                    const isSubActive = String(selectedCategory) === String(sub.id);
                    return (
                      <button
                        key={sub.id}
                        onClick={() => { handleSubClick(sub.id); if (onClose) onClose(); }}
                        className={`w-full text-left text-[11px] px-2 py-2 transition-all cursor-pointer leading-tight
                          ${isSubActive
                            ? 'text-primary font-medium'
                            : 'text-ash hover:text-primary'
                          }`}
                      >
                        {sub.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Page header */}
      <div className="border-b border-black/5 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-5 sm:py-8">
          {/* Breadcrumb */}
          {selectedCat && (
            <div className="flex items-center gap-1.5 text-[10px] text-ash tracking-[0.1em] mb-2 sm:mb-3">
              <button onClick={() => setSelectedCategory('')} className="hover:text-primary transition-colors cursor-pointer">Каталог</button>
              {parentCat && parentCat.id !== selectedCat.id && (
                <>
                  <ChevronRight size={9} className="text-mist" />
                  <button onClick={() => handleParentClick(parentCat.id)} className="hover:text-primary transition-colors cursor-pointer">{parentCat.name}</button>
                </>
              )}
              {isSubSelected && (
                <>
                  <ChevronRight size={9} className="text-mist" />
                  <span className="text-primary">{selectedCatName}</span>
                </>
              )}
            </div>
          )}
          <div className="flex items-center gap-4">
            <div>
              <span className="label">Каталог</span>
              <h1 className="font-serif text-xl sm:text-3xl lg:text-4xl text-primary tracking-tight mt-1 leading-tight">
                {selectedCatName || 'Оборудование'}
              </h1>
            </div>
            {!loading && selectedCategory && (
              <span className="text-ash text-xs sm:text-sm mt-auto mb-0.5">{total} позиций</span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-5 sm:py-8 lg:py-10">
        <div className="flex gap-6 lg:gap-10">

          {/* ── Sidebar — desktop ── */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-28">
              <h4 className="text-[10px] font-medium text-primary mb-3 tracking-[0.3em] uppercase px-3">Категории</h4>
              <CategoryList />

              {selectedCategory && (
                <>
                  <div className="h-px bg-black/5 my-5" />
                  <h4 className="text-[10px] font-medium text-primary mb-3 tracking-[0.3em] uppercase px-3">Наличие</h4>
                  <div className="space-y-0.5">
                    {[
                      { value: 'all', label: 'Все товары', dot: 'bg-black/15' },
                      { value: 'in_stock', label: 'В наличии', dot: 'bg-emerald-500' },
                      { value: 'to_order', label: 'Под заказ', dot: 'bg-amber-400' },
                    ].map(opt => (
                      <button key={opt.value} onClick={() => setStockFilter(opt.value)}
                        className={`w-full text-left text-[12px] px-3 py-2.5 transition-all cursor-pointer flex items-center gap-3 border-l-2
                          ${stockFilter === opt.value ? 'text-primary font-medium border-copper bg-ivory/50' : 'text-ash hover:text-primary border-transparent hover:border-black/10'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${opt.dot} shrink-0`} />
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {brands.length > 0 && (
                    <>
                      <div className="h-px bg-black/5 my-5" />
                      <h4 className="text-[10px] font-medium text-primary mb-3 tracking-[0.3em] uppercase px-3">Бренд</h4>
                      <div className="space-y-0 max-h-[240px] overflow-y-auto">
                        <button onClick={() => setSelectedBrand('')}
                          className={`w-full text-left text-[12px] px-3 py-2 transition-all cursor-pointer border-l-2
                            ${!selectedBrand ? 'text-primary font-medium border-copper bg-ivory/50' : 'text-ash hover:text-primary border-transparent hover:border-black/10'}`}>
                          Все бренды
                        </button>
                        {brands.map(brand => (
                          <button key={brand} onClick={() => setSelectedBrand(brand)}
                            className={`w-full text-left text-[12px] px-3 py-2 transition-all cursor-pointer border-l-2
                              ${selectedBrand === brand ? 'text-primary font-medium border-copper bg-ivory/50' : 'text-ash hover:text-primary border-transparent hover:border-black/10'}`}>
                            {brand}
                          </button>
                        ))}
                      </div>
                    </>
                  )}

                  {activeFilters > 0 && (
                    <>
                      <div className="h-px bg-black/5 my-5" />
                      <button onClick={clearAll} className="text-[11px] text-copper hover:text-copper-dark tracking-[0.15em] uppercase cursor-pointer transition-colors px-3">
                        Сбросить фильтры
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </aside>

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0">

            {/* Mobile filter button */}
            <div className="flex items-center justify-between mb-5 lg:hidden">
              <button onClick={() => setShowFilters(true)}
                className="flex items-center gap-2 text-[11px] font-medium text-primary tracking-[0.15em] uppercase cursor-pointer border border-black/10 px-4 py-2.5 hover:border-primary transition-colors">
                <SlidersHorizontal size={13} />
                Категории и фильтры
                {activeFilters > 0 && (
                  <span className="w-5 h-5 bg-primary text-white text-[9px] font-bold flex items-center justify-center ml-1">{activeFilters}</span>
                )}
              </button>
              {selectedCategory && (
                <div className="relative">
                  <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                    className="appearance-none text-[11px] tracking-[0.1em] border border-black/10 px-4 py-2.5 pr-8 focus:outline-none bg-white cursor-pointer text-primary">
                    <option value="default">Сортировка</option>
                    <option value="price-asc">Цена ↑</option>
                    <option value="price-desc">Цена ↓</option>
                    <option value="name">Название</option>
                  </select>
                  <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ash pointer-events-none" />
                </div>
              )}
            </div>

            {/* Desktop toolbar — only shown when category selected */}
            {selectedCategory && (
              <div className="hidden lg:flex items-center justify-between gap-3 mb-6 pb-5 border-b border-black/5">
                <div className="flex items-center gap-1">
                  {[
                    { value: 'all', label: 'Все' },
                    { value: 'in_stock', label: 'В наличии' },
                    { value: 'to_order', label: 'Под заказ' },
                  ].map(opt => (
                    <button key={opt.value} onClick={() => setStockFilter(opt.value)}
                      className={`text-[10px] px-4 py-2 tracking-[0.1em] uppercase transition-all cursor-pointer border
                        ${stockFilter === opt.value ? 'bg-primary text-white border-primary' : 'border-black/10 text-ash hover:text-primary hover:border-primary'}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  {/* Inline search */}
                  <div className="relative">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-mist pointer-events-none" strokeWidth={1.5} />
                    <input
                      type="text"
                      value={searchInput}
                      onChange={handleSearchChange}
                      placeholder="Поиск..."
                      className="border border-black/10 focus:border-primary bg-white text-[12px] py-2 pl-8 pr-6 focus:outline-none transition-colors placeholder:text-mist w-48"
                    />
                    {searchInput && (
                      <button onClick={() => { setSearchInput(''); setSearchQuery(''); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-ash hover:text-primary cursor-pointer">
                        <X size={12} strokeWidth={1.5} />
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                      className="appearance-none text-[11px] tracking-[0.1em] border border-black/10 px-4 py-2 pr-8 focus:outline-none bg-white cursor-pointer text-primary">
                      <option value="default">Сортировка</option>
                      <option value="price-asc">Цена ↑</option>
                      <option value="price-desc">Цена ↓</option>
                      <option value="name">Название</option>
                    </select>
                    <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ash pointer-events-none" />
                  </div>
                </div>
              </div>
            )}

            {/* ── No category selected ── */}
            {!selectedCategory && (
              <div>
                {/* Search bar */}
                <div className="mb-6 sm:mb-8">
                  <div className="relative max-w-lg">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist pointer-events-none" strokeWidth={1.5} />
                    <input
                      type="text"
                      value={searchInput}
                      onChange={handleSearchChange}
                      placeholder="Поиск по всему каталогу..."
                      className="w-full border border-black/10 focus:border-primary bg-white text-sm py-2.5 pl-10 pr-10 focus:outline-none transition-colors placeholder:text-mist rounded-lg"
                    />
                    {searchInput && (
                      <button onClick={() => { setSearchInput(''); setSearchQuery(''); setGlobalResults([]); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-ash hover:text-primary cursor-pointer">
                        <X size={14} strokeWidth={1.5} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Global search results */}
                {searchQuery.trim().length >= 2 ? (
                  globalLoading ? (
                    <div className="flex items-center justify-center py-20">
                      <Loader2 size={24} className="animate-spin text-copper" />
                    </div>
                  ) : globalResults.length > 0 ? (
                    <>
                      <p className="text-[11px] text-ash mb-5 tracking-[0.1em] uppercase">
                        Найдено {globalResults.length} товаров по запросу «{searchQuery}»
                      </p>
                      <div className="grid grid-cols-2 xl:grid-cols-3 gap-x-2.5 gap-y-5 sm:gap-x-4 sm:gap-y-8">
                        {globalResults.map(product => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <Package size={36} className="text-mist mb-4" strokeWidth={1} />
                      <p className="text-ash text-sm font-medium mb-1">Ничего не найдено</p>
                      <p className="text-ash/60 text-xs">Попробуйте другой запрос или выберите категорию</p>
                    </div>
                  )
                ) : (
                  /* Category browse */
                  catLoading ? (
                    <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-copper" /></div>
                  ) : (
                    <div className="space-y-6">
                      {topLevel.map(cat => {
                        const Icon = ICON_MAP[cat.icon] || Package;
                        const children = getChildren(cat.id);
                        return (
                          <div key={cat.id} className="border border-black/5">
                            <button
                              onClick={() => handleParentClick(cat.id)}
                              className="w-full flex items-center gap-4 p-4 sm:p-5 hover:bg-ivory/60 transition-colors cursor-pointer text-left group"
                            >
                              <div className="w-10 h-10 border border-black/8 flex items-center justify-center shrink-0 bg-white group-hover:border-copper/30 transition-colors">
                                <Icon size={16} className="text-copper" strokeWidth={1.5} />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-[13px] sm:text-[14px] font-medium text-primary group-hover:text-copper transition-colors">{cat.name}</h3>
                                {children.length > 0 && (
                                  <p className="text-[11px] text-ash mt-0.5">{children.length} подкатегорий</p>
                                )}
                              </div>
                              <ArrowRight size={15} className="text-black/15 group-hover:text-copper transition-colors" />
                            </button>
                            {children.length > 0 && (
                              <div className="border-t border-black/5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-black/5">
                                {children.map(sub => (
                                  <button
                                    key={sub.id}
                                    onClick={() => handleSubClick(sub.id)}
                                    className="bg-white px-3 sm:px-4 py-2.5 sm:py-3 text-[11px] sm:text-[12px] text-ash hover:text-primary hover:bg-ivory/50 transition-all cursor-pointer text-left"
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
                  )
                )}
              </div>
            )}

            {/* ── Product grid ── */}
            {selectedCategory && (
              <>
                {/* Subcategory quick links */}
                {(() => {
                  const activeCat = allCategories.find(c => String(c.id) === String(selectedCategory));
                  const parentId = activeCat?.isTopLevel ? activeCat.id : activeCat?.parentId;
                  const subs = parentId ? getChildren(parentId) : [];
                  if (subs.length === 0) return null;
                  return (
                    <div className="flex flex-wrap gap-2 mb-5 sm:mb-6">
                      {parentId && (
                        <button
                          onClick={() => handleParentClick(parentId)}
                          className={`text-[10px] px-3 py-1.5 border transition-all cursor-pointer tracking-[0.08em]
                            ${String(selectedCategory) === String(parentId) ? 'bg-primary text-white border-primary' : 'border-black/10 text-ash hover:text-primary hover:border-primary'}`}
                        >
                          Все
                        </button>
                      )}
                      {subs.map(sub => (
                        <button
                          key={sub.id}
                          onClick={() => handleSubClick(sub.id)}
                          className={`text-[10px] px-3 py-1.5 border transition-all cursor-pointer tracking-[0.08em]
                            ${String(selectedCategory) === String(sub.id) ? 'bg-primary text-white border-primary' : 'border-black/10 text-ash hover:text-primary hover:border-primary'}`}
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  );
                })()}

                {loading ? (
                  <div className="flex items-center justify-center py-20 sm:py-28">
                    <Loader2 size={24} className="animate-spin text-copper" />
                  </div>
                ) : products.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 xl:grid-cols-3 gap-x-2.5 gap-y-5 sm:gap-x-4 sm:gap-y-8">
                      {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-1.5 mt-10 sm:mt-12">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                          className="w-9 h-9 border border-black/10 flex items-center justify-center text-ash hover:text-primary hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer">
                          <ChevronLeft size={16} />
                        </button>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                          let pageNum;
                          const maxShow = Math.min(totalPages, 5);
                          if (totalPages <= 5) pageNum = i + 1;
                          else if (page <= 3) pageNum = i + 1;
                          else if (page >= totalPages - 2) pageNum = totalPages - maxShow + 1 + i;
                          else pageNum = page - 2 + i;
                          return (
                            <button key={pageNum} onClick={() => setPage(pageNum)}
                              className={`w-9 h-9 border flex items-center justify-center text-[11px] font-medium tracking-wider transition-colors cursor-pointer
                                ${page === pageNum ? 'bg-primary text-white border-primary' : 'border-black/10 text-ash hover:text-primary hover:border-primary'}`}>
                              {pageNum}
                            </button>
                          );
                        })}
                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                          className="w-9 h-9 border border-black/10 flex items-center justify-center text-ash hover:text-primary hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer">
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-16 sm:py-24">
                    {stockFilter !== 'all' ? (
                      <div>
                        <Package size={36} className="mx-auto text-black/10 mb-5" strokeWidth={1} />
                        <p className="text-primary text-base font-serif mb-3">
                          {stockFilter === 'in_stock' ? 'Нет товаров в наличии' : 'Нет товаров под заказ'}
                        </p>
                        <button onClick={() => setStockFilter('all')} className="btn-outline text-[10px]">
                          Показать все товары
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Package size={36} className="mx-auto text-black/10 mb-5" strokeWidth={1} />
                        <p className="text-mist text-base font-light font-serif italic mb-4">Ничего не найдено</p>
                        {activeFilters > 0 && (
                          <button onClick={clearAll} className="btn-outline text-[10px]">Сбросить фильтры</button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile filter drawer ── */}
      {showFilters && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
          <div className="absolute inset-y-0 left-0 w-[88%] max-w-sm bg-white flex flex-col animate-slide-in overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-black/5 sticky top-0 bg-white z-10">
              <h3 className="text-[11px] font-medium tracking-[0.2em] uppercase text-primary">Категории</h3>
              <button onClick={() => setShowFilters(false)} className="w-10 h-10 flex items-center justify-center text-ash cursor-pointer hover:text-primary transition-colors">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 px-4 py-5 space-y-6">
              <div>
                <CategoryList onClose={() => setShowFilters(false)} />
              </div>

              {selectedCategory && (
                <>
                  <div className="h-px bg-black/5" />
                  <div>
                    <h4 className="text-[10px] font-medium text-primary mb-3 tracking-[0.2em] uppercase px-3">Наличие</h4>
                    <div className="flex flex-wrap gap-2 px-3">
                      {[
                        { value: 'all', label: 'Все' },
                        { value: 'in_stock', label: 'В наличии' },
                        { value: 'to_order', label: 'Под заказ' },
                      ].map(opt => (
                        <button key={opt.value} onClick={() => setStockFilter(opt.value)}
                          className={`text-[10px] px-4 py-2.5 border transition-colors cursor-pointer tracking-[0.1em] uppercase
                            ${stockFilter === opt.value ? 'bg-primary text-white border-primary' : 'border-black/10 text-ash hover:text-primary hover:border-primary'}`}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {brands.length > 0 && (
                    <>
                      <div className="h-px bg-black/5" />
                      <div>
                        <h4 className="text-[10px] font-medium text-primary mb-3 tracking-[0.2em] uppercase px-3">Бренд</h4>
                        <div className="flex flex-wrap gap-2 px-3">
                          {brands.slice(0, 20).map(brand => (
                            <button key={brand} onClick={() => setSelectedBrand(selectedBrand === brand ? '' : brand)}
                              className={`text-[10px] px-3 py-2 border transition-colors cursor-pointer
                                ${selectedBrand === brand ? 'bg-primary text-white border-primary' : 'border-black/10 text-ash hover:text-primary hover:border-primary'}`}>
                              {brand}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

            <div className="sticky bottom-0 bg-white border-t border-black/5 px-5 py-4 flex gap-3">
              {activeFilters > 0 && (
                <button onClick={clearAll} className="btn-outline text-[10px] py-3 flex-1">Сбросить</button>
              )}
              <button onClick={() => setShowFilters(false)} className="btn-primary text-[10px] py-3 flex-1">
                Показать товары
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
