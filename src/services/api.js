/**
 * API-сервис — проксирует запросы через /api/ серверные функции.
 * Моковые данные используются как fallback при ошибках.
 */

import { products as mockProducts, categories as mockCategories, brands as mockBrands } from '../data/products';

// ─── Fetch wrapper ────────────────────────────────────────────────

async function apiCall(path) {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

// ─── Products ─────────────────────────────────────────────────────

export async function fetchProducts(filters = {}) {
  try {
    if (!filters.category) {
      throw new Error('category_id required');
    }
    const params = new URLSearchParams();
    params.set('category_id', filters.category);
    if (filters.brand) params.set('brand', filters.brand);
    if (filters.search) params.set('search', filters.search);
    if (filters.sort) params.set('sort', filters.sort);
    if (filters.page) params.set('page', filters.page);
    if (filters.per_page) params.set('per_page', filters.per_page);
    if (filters.in_stock) params.set('in_stock', '1');

    const data = await apiCall(`/api/products?${params}`);
    return data;
  } catch (err) {
    console.warn('API fallback to mock:', err.message);
    let result = [...mockProducts];
    if (filters.category) result = result.filter(p => p.category === filters.category);
    if (filters.brand) result = result.filter(p => p.brand === filters.brand);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }
    if (filters.sort === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (filters.sort === 'price-desc') result.sort((a, b) => b.price - a.price);
    if (filters.sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
    return { data: result, total: result.length, page: 1, per_page: 24, totalPages: 1, brands: mockBrands };
  }
}

export async function searchProducts(query) {
  if (!query || query.trim().length < 2) return [];
  try {
    const data = await apiCall(`/api/search?query=${encodeURIComponent(query.trim())}`);
    return data.data || [];
  } catch {
    return [];
  }
}

export async function fetchProduct(id) {
  try {
    const data = await apiCall(`/api/product/${id}`);
    return data.data;
  } catch (err) {
    console.warn('API fallback to mock:', err.message);
    return mockProducts.find(p => p.id === Number(id)) || null;
  }
}

// ─── Categories ───────────────────────────────────────────────────

export async function fetchCategories() {
  try {
    const data = await apiCall('/api/categories');
    return data.data || [];
  } catch (err) {
    console.warn('API fallback to mock:', err.message);
    return mockCategories;
  }
}

// ─── Brands ───────────────────────────────────────────────────────

export async function fetchBrands(categoryId) {
  try {
    const params = categoryId ? `?category_id=${categoryId}` : '';
    const data = await apiCall(`/api/brands${params}`);
    return data.data || [];
  } catch (err) {
    console.warn('API fallback to mock:', err.message);
    return mockBrands;
  }
}

// ─── WhatsApp & Phone helpers ─────────────────────────────────────

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
