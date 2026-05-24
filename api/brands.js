import { fetchBrandsByCategory } from './_lib/equip-client.js';

export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { category_id } = req.query;
    const brands = await fetchBrandsByCategory(category_id || null);

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=7200');
    return res.status(200).json({ data: brands, total: brands.length });
  } catch (err) {
    console.error('Brands error:', err);
    return res.status(502).json({ error: 'Failed to fetch brands' });
  }
}
