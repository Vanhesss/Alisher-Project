import { fetchProductsPage, fetchAllInStock } from './_lib/equip-client.js';

export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      category_id,
      page = '1',
      per_page = '24',
      brand,
      sort,
      search,
      in_stock,
    } = req.query;

    if (!category_id) {
      return res.status(400).json({ error: 'category_id is required' });
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const perPage = Math.min(100, Math.max(1, parseInt(per_page, 10) || 24));

    let products;
    let total;

    if (in_stock === '1') {
      // Fetch all products and filter by stock server-side
      const all = await fetchAllInStock(category_id);
      products = all;
      total = all.length;
    } else {
      const pageResult = await fetchProductsPage(category_id, pageNum, perPage);
      products = pageResult.products;
      total = pageResult.total;
    }

    if (brand) {
      products = products.filter(p =>
        p.brand.toLowerCase() === brand.toLowerCase()
      );
    }

    if (search) {
      const q = search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.article.toLowerCase().includes(q)
      );
    }

    if (sort === 'price-asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === 'name') {
      products.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
    }

    // Paginate in-stock results
    let pagedProducts = products;
    if (in_stock === '1') {
      total = products.length;
      const start = (pageNum - 1) * perPage;
      pagedProducts = products.slice(start, start + perPage);
    }

    const totalPages = Math.ceil(total / perPage);

    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=1800');
    return res.status(200).json({
      data: pagedProducts,
      total,
      page: pageNum,
      per_page: perPage,
      totalPages,
    });
  } catch (err) {
    console.error('Products error:', err);
    return res.status(502).json({ error: 'Failed to fetch products' });
  }
}
