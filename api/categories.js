import { fetchCategories } from './_lib/equip-client.js';

// Static mapping for top-level categories: icons and images
const CATEGORY_META = {
  1:    { icon: 'Coffee',         image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop' },
  8:    { icon: 'SprayCan',       image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400&h=300&fit=crop' },
  29:   { icon: 'Sandwich',       image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop' },
  48:   { icon: 'Scale',          image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=400&h=300&fit=crop' },
  60:   { icon: 'UtensilsCrossed',image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop' },
  85:   { icon: 'Droplets',       image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400&h=300&fit=crop' },
  96:   { icon: 'LayoutGrid',     image: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400&h=300&fit=crop' },
  121:  { icon: 'Flame',          image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop' },
  180:  { icon: 'Zap',            image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=400&h=300&fit=crop' },
  203:  { icon: 'Waves',          image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=300&fit=crop' },
  226:  { icon: 'Snowflake',      image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&h=300&fit=crop' },
  257:  { icon: 'Wine',           image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop' },
  301:  { icon: 'Package',        image: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400&h=300&fit=crop' },
  309:  { icon: 'Wrench',         image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=300&fit=crop' },
  325:  { icon: 'Droplets',       image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400&h=300&fit=crop' },
  3527: { icon: 'Factory',        image: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400&h=300&fit=crop' },
  3587: { icon: 'ShoppingCart',   image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop' },
  4388: { icon: 'Wind',           image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&h=300&fit=crop' },
};

const TOP_LEVEL_IDS = [1, 8, 29, 48, 60, 85, 96, 121, 180, 203, 226, 257, 301, 309, 325, 3527, 3587, 4388];

export const config = { maxDuration: 30 };

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sections = await fetchCategories();
    const result = [];

    for (const section of sections) {
      const meta = CATEGORY_META[section.id] || { icon: 'Package', image: '' };
      result.push({
        id: section.id,
        name: section.name,
        icon: meta.icon,
        image: meta.image,
        isTopLevel: section.parent === 0,
        parentId: section.parent === 0 ? null : section.parent,
      });
    }

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=7200');
    return res.status(200).json({ data: result, total: result.length });
  } catch (err) {
    console.error('Categories error:', err);
    return res.status(502).json({ error: 'Failed to fetch categories' });
  }
}
