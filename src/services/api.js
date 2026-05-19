/**
 * API-сервис для интеграции с equip.me (склад Алматы)
 *
 * Сейчас используются моковые данные.
 * При подключении реального API — заменить fetch-вызовы на реальные эндпоинты.
 *
 * Предполагаемая структура API equip.me:
 *   GET /api/v1/products          — список товаров на складе
 *   GET /api/v1/products/:id      — детальная карточка
 *   GET /api/v1/categories        — категории
 *   GET /api/v1/stock/:productId  — наличие на складе Алматы
 */

const API_BASE = import.meta.env.VITE_EQUIPME_API_URL || '';
const API_KEY = import.meta.env.VITE_EQUIPME_API_KEY || '';

const headers = () => ({
  'Content-Type': 'application/json',
  ...(API_KEY && { Authorization: `Bearer ${API_KEY}` }),
});

// ─── Mock data (заменится реальным API) ────────────────────────────

import { products as mockProducts, categories as mockCategories, brands as mockBrands } from '../data/products';

let useMock = !API_BASE;

// ─── Products ──────────────────────────────────────────────────────

export async function fetchProducts(filters = {}) {
  if (useMock) {
    let result = [...mockProducts];
    if (filters.category) result = result.filter(p => p.category === filters.category);
    if (filters.brand) result = result.filter(p => p.brand === filters.brand);
    if (filters.inStock) result = result.filter(p => p.inStock);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.article.toLowerCase().includes(q)
      );
    }
    if (filters.sort === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (filters.sort === 'price-desc') result.sort((a, b) => b.price - a.price);
    if (filters.sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
    return { data: result, total: result.length };
  }

  const params = new URLSearchParams();
  if (filters.category) params.set('category', filters.category);
  if (filters.brand) params.set('brand', filters.brand);
  if (filters.inStock) params.set('in_stock', 'true');
  if (filters.search) params.set('q', filters.search);
  if (filters.sort) params.set('sort', filters.sort);

  const res = await fetch(`${API_BASE}/api/v1/products?${params}`, { headers: headers() });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function fetchProduct(id) {
  if (useMock) {
    const product = mockProducts.find(p => p.id === Number(id));
    if (!product) return null;
    return product;
  }

  const res = await fetch(`${API_BASE}/api/v1/products/${id}`, { headers: headers() });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchCategories() {
  if (useMock) return mockCategories;

  const res = await fetch(`${API_BASE}/api/v1/categories`, { headers: headers() });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function fetchBrands() {
  if (useMock) return mockBrands;

  const res = await fetch(`${API_BASE}/api/v1/brands`, { headers: headers() });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// ─── Stock check ───────────────────────────────────────────────────

export async function checkStock(productId) {
  if (useMock) {
    const product = mockProducts.find(p => p.id === Number(productId));
    return {
      inStock: product?.inStock ?? false,
      warehouse: 'Алматы',
      supplier: 'equip.me',
    };
  }

  const res = await fetch(`${API_BASE}/api/v1/stock/${productId}`, { headers: headers() });
  if (!res.ok) return { inStock: false, warehouse: 'Алматы', supplier: 'equip.me' };
  return res.json();
}

// ─── WhatsApp helpers ──────────────────────────────────────────────

const WHATSAPP_NUMBER = '77001234567';

export function getWhatsAppLink(product = null) {
  let text = 'Здравствуйте! ';
  if (product) {
    text += `Интересует "${product.name}" (арт. ${product.article}). Товар в наличии? Какая актуальная цена?`;
  } else {
    text += 'Хотел бы узнать о наличии оборудования на складе.';
  }
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function getPhoneLink() {
  return `tel:+${WHATSAPP_NUMBER}`;
}

export { WHATSAPP_NUMBER };
