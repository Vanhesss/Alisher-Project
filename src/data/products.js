export const categories = [
  { id: 'thermal', name: 'Тепловое оборудование', icon: 'Flame', count: 124, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop' },
  { id: 'cold', name: 'Холодильное оборудование', icon: 'Snowflake', count: 89, image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&h=300&fit=crop' },
  { id: 'neutral', name: 'Нейтральное оборудование', icon: 'LayoutGrid', count: 156, image: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400&h=300&fit=crop' },
  { id: 'bar', name: 'Барное оборудование', icon: 'Wine', count: 67, image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop' },
  { id: 'coffee', name: 'Кофейное оборудование', icon: 'Coffee', count: 45, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop' },
  { id: 'dishwash', name: 'Посудомоечное оборудование', icon: 'Droplets', count: 34, image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400&h=300&fit=crop' },
  { id: 'electro', name: 'Электромеханическое', icon: 'Zap', count: 78, image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=400&h=300&fit=crop' },
  { id: 'ventilation', name: 'Вентиляция', icon: 'Wind', count: 23, image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop' },
  { id: 'accessories', name: 'Аксессуары', icon: 'Wrench', count: 210, image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=300&fit=crop' },
];

export const brands = [
  'Rational', 'Electrolux', 'Bertos', 'Angelo Po', 'Fagor', 'Hendi', 'Robot Coupe', 'Sammic'
];

export const products = [
  {
    id: 1,
    name: 'Пароконвектомат Rational iCombi Pro 6-1/1',
    article: 'RAT-ICP-611',
    brand: 'Rational',
    category: 'thermal',
    price: 4850000,
    oldPrice: 5200000,
    inStock: true,
    isNew: true,
    isHit: false,
    image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=500&h=500&fit=crop',
    description: 'Пароконвектомат нового поколения с интеллектуальной системой приготовления.',
    specs: { 'Мощность': '19.8 кВт', 'Вместимость': '6 GN 1/1', 'Размеры': '850x842x754 мм', 'Вес': '113 кг' }
  },
  {
    id: 2,
    name: 'Холодильный шкаф Electrolux RE471FF',
    article: 'ELX-RE471',
    brand: 'Electrolux',
    category: 'cold',
    price: 1250000,
    oldPrice: null,
    inStock: true,
    isNew: false,
    isHit: true,
    image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=500&h=500&fit=crop',
    description: 'Профессиональный холодильный шкаф с цифровым управлением.',
    specs: { 'Объем': '670 л', 'Температура': '-2/+10 °C', 'Размеры': '710x800x2050 мм', 'Хладагент': 'R290' }
  },
  {
    id: 3,
    name: 'Кофемашина La Cimbali M200 GT1',
    article: 'LCM-M200GT1',
    brand: 'La Cimbali',
    category: 'coffee',
    price: 3200000,
    oldPrice: 3500000,
    inStock: true,
    isNew: true,
    isHit: true,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=500&fit=crop',
    description: 'Профессиональная кофемашина с системой автоматического пара.',
    specs: { 'Группы': '1', 'Бойлер': '5 л', 'Мощность': '2.7 кВт', 'Размеры': '530x570x480 мм' }
  },
  {
    id: 4,
    name: 'Посудомоечная машина Fagor CO-502',
    article: 'FGR-CO502',
    brand: 'Fagor',
    category: 'dishwash',
    price: 890000,
    oldPrice: null,
    inStock: false,
    isNew: false,
    isHit: false,
    image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500&h=500&fit=crop',
    description: 'Купольная посудомоечная машина с высокой производительностью.',
    specs: { 'Производительность': '60 кассет/ч', 'Мощность': '6.7 кВт', 'Размеры': '600x703x1410 мм' }
  },
  {
    id: 5,
    name: 'Плита индукционная Bertos E7P4M/IND',
    article: 'BRT-E7P4M',
    brand: 'Bertos',
    category: 'thermal',
    price: 1780000,
    oldPrice: 1900000,
    inStock: true,
    isNew: false,
    isHit: true,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop',
    description: '4-конфорочная индукционная плита профессиональной серии.',
    specs: { 'Конфорки': '4', 'Мощность': '20 кВт', 'Размеры': '800x730x870 мм' }
  },
  {
    id: 6,
    name: 'Блендер Robot Coupe Blixer 6 V.V.',
    article: 'RC-BLX6VV',
    brand: 'Robot Coupe',
    category: 'electro',
    price: 650000,
    oldPrice: null,
    inStock: true,
    isNew: true,
    isHit: false,
    image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500&h=500&fit=crop',
    description: 'Куттер-блендер с плавной регулировкой скорости.',
    specs: { 'Объем чаши': '7 л', 'Мощность': '1500 Вт', 'Скорость': '300-3500 об/мин' }
  },
  {
    id: 7,
    name: 'Льдогенератор Hendi 271568',
    article: 'HND-271568',
    brand: 'Hendi',
    category: 'bar',
    price: 420000,
    oldPrice: 480000,
    inStock: true,
    isNew: false,
    isHit: false,
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=500&h=500&fit=crop',
    description: 'Компактный льдогенератор для барного использования.',
    specs: { 'Производительность': '40 кг/24ч', 'Бункер': '15 кг', 'Тип льда': 'кубики' }
  },
  {
    id: 8,
    name: 'Стол холодильный Angelo Po 6MFC',
    article: 'AP-6MFC',
    brand: 'Angelo Po',
    category: 'cold',
    price: 980000,
    oldPrice: null,
    inStock: true,
    isNew: false,
    isHit: true,
    image: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=500&h=500&fit=crop',
    description: 'Стол холодильный с тремя дверями для профессиональной кухни.',
    specs: { 'Объем': '460 л', 'Температура': '-2/+8 °C', 'Размеры': '1800x700x850 мм', 'Двери': '3' }
  },
];

export function formatPrice(price) {
  return new Intl.NumberFormat('ru-RU').format(price) + ' ₸';
}
