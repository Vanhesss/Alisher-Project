import { equipSearch } from './_lib/equip-client.js';

export const config = { maxDuration: 30 };

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.query;
  if (!query || query.trim().length < 2) {
    return res.status(400).json({ error: 'query must be at least 2 characters' });
  }

  try {
    const results = await equipSearch(query.trim());
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=1800');
    return res.status(200).json({ data: results, total: results.length, query });
  } catch (err) {
    console.error('Search error:', err);
    return res.status(502).json({ error: 'Search failed' });
  }
}
