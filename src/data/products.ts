import { Product, Review } from '@/types';

const IMG = 'https://images.unsplash.com/';

export const products: Product[] = [
  {
    id: '1', name: 'AeroGlide Runner', brand: 'AvenzShoe', category: 'sneakers', gender: 'men',
    price: 189, oldPrice: 249, discount: 24,
    images: [
      `${IMG}photo-1542291026-7eec264c27ff?w=800`, `${IMG}photo-1606107557195-0e29a4b5b4aa?w=800`,
      `${IMG}photo-1608231387042-66d1773070a5?w=800`, `${IMG}photo-1595950653106-6c9ebd614d3a?w=800`,
    ],
    sizes: [7, 8, 9, 10, 11, 12], colors: [{ name: 'Crimson Red', hex: '#DC2626' }, { name: 'Midnight Black', hex: '#1a1a1a' }, { name: 'Arctic White', hex: '#f5f5f5' }],
    rating: 4.8, reviewsCount: 342, description: 'Experience unparalleled comfort with the AeroGlide Runner. Engineered with responsive cushioning and breathable mesh upper for the ultimate running experience.',
    features: ['Responsive foam cushioning', 'Breathable knit upper', 'Rubber outsole grip', 'Reflective details', 'Lightweight construction'],
    stock: 45, sku: 'AVZ-AG-001', tags: ['running', 'sport', 'bestseller'], isNew: false, isBestSeller: true, isTrending: true,
  },
  {
    id: '2', name: 'Luxe Oxford Classic', brand: 'AvenzShoe', category: 'formal', gender: 'men',
    price: 299, oldPrice: 379, discount: 21,
    images: [
      `${IMG}photo-1614252369475-531eba835eb1?w=800`, `${IMG}photo-1533867617858-e7b97e060509?w=800`,
      `${IMG}photo-1605812860427-4024433a70fd?w=800`,
    ],
    sizes: [7, 8, 9, 10, 11], colors: [{ name: 'Cognac Brown', hex: '#8B4513' }, { name: 'Classic Black', hex: '#111' }],
    rating: 4.9, reviewsCount: 189, description: 'Handcrafted from premium Italian leather, the Luxe Oxford Classic embodies timeless elegance. Perfect for business meetings and formal occasions.',
    features: ['Italian leather', 'Blake-stitched sole', 'Leather lining', 'Cushioned insole', 'Hand-burnished finish'],
    stock: 28, sku: 'AVZ-LO-002', tags: ['formal', 'leather', 'premium'], isBestSeller: true,
  },
  {
    id: '3', name: 'CloudStep Casual', brand: 'AvenzShoe', category: 'casual', gender: 'women',
    price: 149, oldPrice: 199, discount: 25,
    images: [
      `${IMG}photo-1560769629-975ec94e6a86?w=800`, `${IMG}photo-1465453869711-7e174808ace9?w=800`,
      `${IMG}photo-1551107696-a4b0c5a0d9a2?w=800`,
    ],
    sizes: [5, 6, 7, 8, 9], colors: [{ name: 'Blush Pink', hex: '#F9A8D4' }, { name: 'Cloud White', hex: '#fafafa' }, { name: 'Sage Green', hex: '#86EFAC' }],
    rating: 4.7, reviewsCount: 256, description: 'Walk on clouds with every step. The CloudStep Casual features our signature comfort technology wrapped in a sleek, versatile design.',
    features: ['CloudFoam insole', 'Flexible outsole', 'Slip-resistant', 'Machine washable', 'Eco-friendly materials'],
    stock: 62, sku: 'AVZ-CS-003', tags: ['casual', 'comfort', 'women'], isNew: true, isTrending: true,
  },
  {
    id: '4', name: 'StreetKing High-Top', brand: 'AvenzShoe', category: 'sneakers', gender: 'unisex',
    price: 219, oldPrice: 279, discount: 21,
    images: [
      `${IMG}photo-1584735175315-9d5df23860e6?w=800`, `${IMG}photo-1597045566677-8cf032ed6634?w=800`,
      `${IMG}photo-1600269452121-4f2416e55c28?w=800`,
    ],
    sizes: [6, 7, 8, 9, 10, 11, 12], colors: [{ name: 'Jet Black', hex: '#0a0a0a' }, { name: 'Off White', hex: '#F5F0E8' }],
    rating: 4.6, reviewsCount: 412, description: 'Dominate the streets in style. The StreetKing High-Top combines bold design with premium materials for the ultimate streetwear statement.',
    features: ['Premium suede/leather combo', 'Padded ankle collar', 'Custom lace system', 'Vulcanized sole', 'Iconic branding'],
    stock: 35, sku: 'AVZ-SK-004', tags: ['streetwear', 'hightop', 'trending'], isTrending: true,
  },
  {
    id: '5', name: 'TrailBlazer Boot', brand: 'AvenzShoe', category: 'boots', gender: 'men',
    price: 269, oldPrice: 329, discount: 18,
    images: [
      `${IMG}photo-1608256246200-53e635b5b65f?w=800`, `${IMG}photo-1605733160314-4fc7dac4bb16?w=800`,
    ],
    sizes: [8, 9, 10, 11, 12], colors: [{ name: 'Timber Brown', hex: '#6B4423' }, { name: 'Charcoal', hex: '#374151' }],
    rating: 4.7, reviewsCount: 178, description: 'Built for adventure. The TrailBlazer Boot offers rugged durability with waterproof protection and superior traction on any terrain.',
    features: ['Waterproof membrane', 'Vibram outsole', 'Thinsulate insulation', 'Full-grain leather', 'Speed-lace system'],
    stock: 19, sku: 'AVZ-TB-005', tags: ['boots', 'outdoor', 'waterproof'],
  },
  {
    id: '6', name: 'Breeze Sandal', brand: 'AvenzShoe', category: 'sandals', gender: 'women',
    price: 89, oldPrice: 119, discount: 25,
    images: [
      `${IMG}photo-1603487742131-4160ec999306?w=800`, `${IMG}photo-1562273138-f9c06c4888e5?w=800`,
    ],
    sizes: [5, 6, 7, 8, 9], colors: [{ name: 'Tan', hex: '#D2B48C' }, { name: 'Black', hex: '#111' }, { name: 'Rose Gold', hex: '#B76E79' }],
    rating: 4.5, reviewsCount: 203, description: 'Effortless elegance meets all-day comfort. The Breeze Sandal features a contoured footbed and adjustable straps for the perfect fit.',
    features: ['Contoured footbed', 'Adjustable straps', 'Cork-latex midsole', 'Suede lining', 'EVA outsole'],
    stock: 54, sku: 'AVZ-BS-006', tags: ['sandals', 'summer', 'comfort'], isNew: true,
  },
  {
    id: '7', name: 'Junior Sprint', brand: 'AvenzShoe', category: 'sneakers', gender: 'kids',
    price: 79, oldPrice: 99, discount: 20,
    images: [
      `${IMG}photo-1514989940723-e8e51635b782?w=800`, `${IMG}photo-1606890737304-57a1ca8a5b62?w=800`,
    ],
    sizes: [1, 2, 3, 4, 5, 6], colors: [{ name: 'Electric Blue', hex: '#3B82F6' }, { name: 'Neon Green', hex: '#22C55E' }],
    rating: 4.6, reviewsCount: 156, description: 'Let them run free! The Junior Sprint is designed for active kids with easy on/off, durable materials, and supportive cushioning.',
    features: ['Velcro closure', 'Reinforced toe', 'Flexible sole', 'Breathable mesh', 'Non-marking outsole'],
    stock: 72, sku: 'AVZ-JS-007', tags: ['kids', 'sport', 'school'], isNew: true,
  },
  {
    id: '8', name: 'Velocity Pro', brand: 'AvenzShoe', category: 'sports', gender: 'unisex',
    price: 229, oldPrice: 289, discount: 21,
    images: [
      `${IMG}photo-1539185441755-769473a23570?w=800`, `${IMG}photo-1491553895911-0055eca6402d?w=800`,
      `${IMG}photo-1460353581641-37baddab0fa2?w=800`,
    ],
    sizes: [6, 7, 8, 9, 10, 11, 12], colors: [{ name: 'Solar Orange', hex: '#F97316' }, { name: 'Deep Navy', hex: '#1E3A5F' }, { name: 'Pure White', hex: '#fff' }],
    rating: 4.8, reviewsCount: 298, description: 'Engineered for peak performance. The Velocity Pro features carbon-fiber plate technology and energy-return foam for record-breaking runs.',
    features: ['Carbon-fiber plate', 'ZoomX foam', 'Engineered mesh', 'Dynamic lacing', 'Race-day geometry'],
    stock: 31, sku: 'AVZ-VP-008', tags: ['running', 'performance', 'pro'], isBestSeller: true, isTrending: true,
  },
  {
    id: '9', name: 'Elegance Pump', brand: 'AvenzShoe', category: 'formal', gender: 'women',
    price: 259, oldPrice: 319, discount: 19,
    images: [
      `${IMG}photo-1543163521-1bf539c55dd2?w=800`, `${IMG}photo-1515347619252-60a4bf4fff4f?w=800`,
    ],
    sizes: [5, 6, 7, 8, 9], colors: [{ name: 'Nude', hex: '#E8C4A0' }, { name: 'Classic Black', hex: '#111' }, { name: 'Ruby Red', hex: '#DC143C' }],
    rating: 4.7, reviewsCount: 167, description: 'Timeless sophistication for every occasion. The Elegance Pump features a sculpted heel, cushioned insole, and premium finish.',
    features: ['3-inch sculpted heel', 'Memory foam insole', 'Patent leather finish', 'Non-slip sole', 'Italian craftsmanship'],
    stock: 38, sku: 'AVZ-EP-009', tags: ['formal', 'heels', 'elegant'],
  },
  {
    id: '10', name: 'Urban Flex Slip-On', brand: 'AvenzShoe', category: 'casual', gender: 'men',
    price: 129, oldPrice: 169, discount: 24,
    images: [
      `${IMG}photo-1525966222134-fcfa99b8ae77?w=800`, `${IMG}photo-1600185365926-3a2ce3cdb9eb?w=800`,
    ],
    sizes: [7, 8, 9, 10, 11, 12], colors: [{ name: 'Navy', hex: '#1E3A5F' }, { name: 'Gray', hex: '#6B7280' }, { name: 'Olive', hex: '#6B8E23' }],
    rating: 4.5, reviewsCount: 224, description: 'Slip into comfort. The Urban Flex combines modern minimalism with all-day wearability for the modern professional.',
    features: ['Stretch-knit upper', 'Memory foam insole', 'Slip-on design', 'Lightweight EVA sole', 'Machine washable'],
    stock: 48, sku: 'AVZ-UF-010', tags: ['casual', 'slip-on', 'comfort'], isBestSeller: true,
  },
  {
    id: '11', name: 'Summit Hiker', brand: 'AvenzShoe', category: 'boots', gender: 'unisex',
    price: 289, images: [
      `${IMG}photo-1520219306100-ec4afeeefe58?w=800`, `${IMG}photo-1606890737304-57a1ca8a5b62?w=800`,
    ],
    sizes: [7, 8, 9, 10, 11, 12], colors: [{ name: 'Earth Brown', hex: '#8B6914' }, { name: 'Storm Gray', hex: '#4B5563' }],
    rating: 4.6, reviewsCount: 134, description: 'Conquer any peak. Premium hiking boot with Gore-Tex lining and Vibram Megagrip for unmatched trail performance.',
    features: ['Gore-Tex waterproof', 'Vibram Megagrip', 'Nubuck leather', 'Ankle support', 'Shock absorbing'],
    stock: 22, sku: 'AVZ-SH-011', tags: ['hiking', 'outdoor', 'adventure'], isNew: true,
  },
  {
    id: '12', name: 'Retro Wave 90s', brand: 'AvenzShoe', category: 'sneakers', gender: 'unisex',
    price: 169, oldPrice: 209, discount: 19,
    images: [
      `${IMG}photo-1549298916-b41d501d3772?w=800`, `${IMG}photo-1587563871167-1ee9c731aefb?w=800`,
    ],
    sizes: [6, 7, 8, 9, 10, 11], colors: [{ name: 'Multicolor', hex: '#8B5CF6' }, { name: 'Retro White', hex: '#FEF3C7' }],
    rating: 4.4, reviewsCount: 321, description: 'Nostalgia meets modern comfort. The Retro Wave 90s brings back iconic chunky sole design with today\'s cushioning technology.',
    features: ['Chunky platform sole', 'Mixed material upper', 'Retro colorways', 'Air cushion unit', 'Padded tongue'],
    stock: 41, sku: 'AVZ-RW-012', tags: ['retro', 'chunky', 'streetwear'], isTrending: true,
  },
];

export const reviews: Review[] = [
  { id: '1', productId: '1', userName: 'James K.', rating: 5, comment: 'Best running shoes I\'ve ever owned. The cushioning is incredible and they look amazing.', date: '2024-03-10', verified: true },
  { id: '2', productId: '1', userName: 'Sarah M.', rating: 5, comment: 'Super lightweight and breathable. Perfect for my daily runs.', date: '2024-03-08', verified: true },
  { id: '3', productId: '1', userName: 'Mike D.', rating: 4, comment: 'Great shoe overall, runs slightly narrow. Size up half a size.', date: '2024-03-05', verified: true },
  { id: '4', productId: '2', userName: 'Robert P.', rating: 5, comment: 'Absolutely stunning craftsmanship. These oxfords are worth every penny.', date: '2024-03-12', verified: true },
  { id: '5', productId: '3', userName: 'Emily R.', rating: 5, comment: 'So comfortable! I can wear these all day without any discomfort.', date: '2024-03-11', verified: true },
  { id: '6', productId: '8', userName: 'Alex T.', rating: 5, comment: 'These took 3 minutes off my PR. The carbon plate is a game changer!', date: '2024-03-09', verified: true },
];

export const brands = ['AvenzShoe', 'Nike', 'Adidas', 'New Balance', 'Puma'];
export const categories = ['sneakers', 'formal', 'casual', 'boots', 'sandals', 'sports'];
export const genders = ['men', 'women', 'kids', 'unisex'];
