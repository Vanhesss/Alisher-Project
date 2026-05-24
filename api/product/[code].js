import { fetchSingleProduct } from '../_lib/equip-client.js';

export const config = { maxDuration: 30 };

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ error: 'Product code required' });
    }

    const product = await fetchSingleProduct(code);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=1200');
    return res.status(200).json({ data: product });
  } catch (err) {
    console.error('Product detail error:', err);
    return res.status(502).json({ error: 'Failed to fetch product' });
  }
}
