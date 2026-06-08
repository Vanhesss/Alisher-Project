const API_BASE = 'https://api.equip.me/v1';
const API_KEY = process.env.EQUIPME_API_KEY || '';
const KZT_RATE = parseFloat(process.env.KZT_RATE || '7.0');

// --- In-memory cache with TTL ---
const cache = new Map();

function cacheGet(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function cacheSet(key, data, ttlMs) {
  cache.set(key, { data, expires: Date.now() + ttlMs });
}

// --- Fetch wrapper with retry for rate limits ---
async function equipFetch(path, params = {}) {
  const url = new URL(`${API_BASE}${path}`);
  url.searchParams.set('apikey', API_KEY);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') {
      url.searchParams.set(k, String(v));
    }
  }

  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url.toString());
    if (res.status === 429) {
      // Rate limited — wait and retry
      const wait = (attempt + 1) * 2000;
      await new Promise(r => setTimeout(r, wait));
      continue;
    }
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.error(`equip.me ${res.status}: ${url.pathname}${url.search} — ${body.slice(0, 200)}`);
      throw new Error(`equip.me API error: ${res.status} ${res.statusText}`);
    }
    const json = await res.json();
    return json.response;
  }
  throw new Error('equip.me API rate limit exceeded after retries');
}

// --- Stock helpers ---
const ALMATY_STOCKS = ['alm', 'alm_u', 'alm_s', 'alm_b'];

function getAlmatyStock(product) {
  let almatyTotal = 0;
  for (const a of product.available || []) {
    const qty = a.quantity_free || 0;
    if (ALMATY_STOCKS.includes(a.stock)) almatyTotal += qty;
  }
  return almatyTotal;  // Только Алматы, без fallback!
}

function getProductPrice(product) {
  // Try Almaty price first, then any available price
  const prices = product.prices || [];
  const almPrice = prices.find(pr => pr.stock === 'alm');
  const p = almPrice || prices[0];
  if (!p) return { price: 0, oldPrice: null };

  const price = Math.round((p.price_discount_rub || p.price_rub || 0) * KZT_RATE * 1.2);
  const rrc = p.price_rub_rrc ? Math.round(p.price_rub_rrc * KZT_RATE * 1.2) : null;
  const oldPrice = rrc && rrc > price ? rrc : null;

  return { price, oldPrice };
}

// --- Transform product ---
function titleCase(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function buildSpecs(props, addProps) {
  const specs = {};

  if (props) {
    const propsMap = {
      heightmm: 'Высота',
      lengthmm: 'Длина',
      widthmm: 'Ширина',
      weightkg: 'Вес',
      voltage: 'Напряжение',
      powerkVt: 'Мощность',
      country: 'Страна',
      warranty: 'Гарантия',
    };
    for (const [key, label] of Object.entries(propsMap)) {
      if (props[key]) {
        let val = props[key];
        if (key === 'heightmm' || key === 'lengthmm' || key === 'widthmm') val += ' мм';
        else if (key === 'weightkg') val += ' кг';
        else if (key === 'voltage') val += ' В';
        else if (key === 'powerkVt') val += ' кВт';
        else if (key === 'warranty') val += ' дн.';
        specs[label] = val;
      }
    }
    // Compose dimensions if all 3 present
    if (props.lengthmm && props.widthmm && props.heightmm) {
      specs['Размеры'] = `${props.lengthmm}x${props.widthmm}x${props.heightmm} мм`;
      delete specs['Длина'];
      delete specs['Ширина'];
      delete specs['Высота'];
    }
  }

  if (Array.isArray(addProps)) {
    for (const prop of addProps) {
      if (prop.name && prop.value) {
        const dim = prop.dimension && prop.dimension !== 'л.' ? ` ${prop.dimension}` : '';
        specs[prop.name] = prop.value + dim;
      }
    }
  }

  return specs;
}

function transformProduct(raw) {
  const { price, oldPrice } = getProductPrice(raw);
  const stockQty = getAlmatyStock(raw);
  const fields = raw.fields || {};
  const props = raw.props || {};

  // Check if stock is specifically in Almaty
  const almatyQty = (raw.available || [])
    .filter(a => ALMATY_STOCKS.includes(a.stock))
    .reduce((s, a) => s + (a.quantity_free || 0), 0);

  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const updatedAt = raw.date_update ? new Date(raw.date_update).getTime() : 0;

  return {
    id: raw.code_1c,
    name: titleCase(fields.name || ''),
    article: String(raw.code_1c),
    brand: fields.brand || '',
    category: fields.category_id || null,
    price,
    oldPrice,
    inStock: stockQty > 0,
    stockQuantity: stockQty,
    inStockAlmaty: almatyQty > 0,
    availability: stockQty > 0 ? 'in_stock' : 'to_order',
    isNew: updatedAt > thirtyDaysAgo,
    isHit: false,
    image: fields.image || '',
    images: [fields.image, ...(fields.add_images || [])].filter(Boolean),
    description: stripHtml(raw.add_desc) || props.description || '',
    specs: buildSpecs(props, raw.add_props),
    deliveryTime: fields.delivery_time,
    files: (raw.files || []).flatMap(group =>
      (group.items || []).map(item => ({
        name: group.name,
        type: group.type,
        url: item.link,
        size: item.size,
        ext: item.extension || 'pdf',
      }))
    ),
  };
}

// --- Public API functions ---

async function fetchCategories() {
  const cacheKey = 'categories';
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const data = await equipFetch('/dealer/products/categories', {
    catalog_type_id: 1,
  });

  const sections = data.sections || [];
  cacheSet(cacheKey, sections, 60 * 60 * 1000); // 1 hour
  return sections;
}

// Paginated fetch — passes pagination directly to equip.me API
async function fetchProductsPage(categoryId, page = 1, perPage = 24) {
  if (!categoryId) {
    return { products: [], total: 0 };
  }

  const cacheKey = `products_page_${categoryId}_${page}_${perPage}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const params = {
    per_page: perPage,
    page,
    active: 1,
    catalog_type_id: 1,
    category_id: categoryId,
    with_rrc: true,
    with_add_photo: true,
    with_category: true,
    with_available: true,
  };

  const data = await equipFetch('/dealer/products', params);
  const rawProducts = data.products || [];
  const total = data.total || 0;

  const products = rawProducts
    .filter(p => (p.prices || []).length > 0)
    .map(transformProduct);

  const result = { products, total };
  cacheSet(cacheKey, result, 15 * 60 * 1000); // 15 min
  return result;
}

// Fetch all brands for a category (fetches first 1000 products for brand list)
async function fetchBrandsByCategory(categoryId) {
  if (!categoryId) return [];

  const cacheKey = `brands_cat_${categoryId}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const data = await equipFetch('/dealer/products', {
    per_page: 1000,
    page: 1,
    active: 1,
    catalog_type_id: 1,
    category_id: categoryId,
    with_category: true,
  });

  const rawProducts = data.products || [];
  const brands = [...new Set(rawProducts.map(p => (p.fields || {}).brand).filter(Boolean))].sort();

  cacheSet(cacheKey, brands, 60 * 60 * 1000); // 1 hour
  return brands;
}

// Global search — fetch small batches from all top-level categories in parallel, filter client-side
const TOP_CATEGORY_IDS = [1, 8, 29, 48, 60, 85, 96, 121, 180, 203, 226, 257, 301, 309, 325, 3527, 3587, 4388];

async function equipSearch(query) {
  const q = query.trim().toLowerCase();
  const cacheKey = `search_${q}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const words = q.split(/\s+/).filter(w => w.length >= 2);

  // Fetch 60 products from each category in parallel (small batches = fast)
  const pages = await Promise.all(
    TOP_CATEGORY_IDS.map(catId =>
      equipFetch('/dealer/products', {
        per_page: 60,
        page: 1,
        active: 1,
        catalog_type_id: 1,
        category_id: catId,
        with_rrc: true,
        with_add_photo: true,
        with_category: true,
        with_available: true,
      })
        .then(data => (data.products || []).filter(p => (p.prices || []).length > 0).map(transformProduct))
        .catch(() => [])
    )
  );

  // Score by how many query words match the product name/brand/article
  const scored = [];
  const seen = new Set();
  for (const products of pages) {
    for (const product of products) {
      if (seen.has(product.id)) continue;
      const haystack = `${product.name} ${product.brand} ${product.article}`.toLowerCase();
      const matchCount = words.filter(w => haystack.includes(w)).length;
      if (matchCount > 0) {
        seen.add(product.id);
        scored.push({ product, matchCount });
      }
    }
  }

  // Sort: most matching words first, then in-stock first
  scored.sort((a, b) =>
    b.matchCount - a.matchCount ||
    (b.product.inStock ? 1 : 0) - (a.product.inStock ? 1 : 0)
  );

  const results = scored.slice(0, 48).map(s => s.product);
  cacheSet(cacheKey, results, 15 * 60 * 1000);
  return results;
}

// Fetch all in-stock products for a category (scans all pages)
async function fetchAllInStock(categoryId) {
  if (!categoryId) return [];

  const cacheKey = `in_stock_${categoryId}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const firstPage = await equipFetch('/dealer/products', {
    per_page: 100,
    page: 1,
    active: 1,
    catalog_type_id: 1,
    category_id: categoryId,
    with_rrc: true,
    with_add_photo: true,
    with_category: true,
    with_available: true,
  });

  const total = firstPage.total || 0;
  const totalPages = Math.ceil(total / 100);
  let allRaw = [...(firstPage.products || [])];

  // Fetch remaining pages in parallel (max 10 pages = 1000 products)
  const remaining = Math.min(totalPages - 1, 9);
  if (remaining > 0) {
    const fetches = Array.from({ length: remaining }, (_, i) =>
      equipFetch('/dealer/products', {
        per_page: 100,
        page: i + 2,
        active: 1,
        catalog_type_id: 1,
        category_id: categoryId,
        with_rrc: true,
        with_add_photo: true,
        with_category: true,
        with_available: true,
      }).then(d => d.products || []).catch(() => [])
    );
    const pages = await Promise.all(fetches);
    for (const p of pages) allRaw = allRaw.concat(p);
  }

  const inStock = allRaw
    .filter(p => (p.prices || []).length > 0)
    .map(transformProduct)
    .filter(p => p.inStock);

  cacheSet(cacheKey, inStock, 15 * 60 * 1000); // 15 min
  return inStock;
}

async function fetchSingleProduct(code1c) {
  const cacheKey = `product_${code1c}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const data = await equipFetch(`/dealer/product/${code1c}`, {
    with_rrc: true,
    with_add_photo: true,
    with_add_desc: true,
    with_add_props: true,
    with_category: true,
    with_available: true,
    with_files: true,
  });

  const products = data.products || [];
  if (products.length === 0) return null;

  const raw = products[0];
  const product = transformProduct(raw);

  cacheSet(cacheKey, product, 10 * 60 * 1000); // 10 min
  return product;
}

export {
  fetchCategories,
  fetchProductsPage,
  fetchAllInStock,
  equipSearch,
  fetchBrandsByCategory,
  fetchSingleProduct,
  getAlmatyStock,
  KZT_RATE,
};
