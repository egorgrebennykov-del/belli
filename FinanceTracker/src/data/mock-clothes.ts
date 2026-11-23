export interface HardcodedProduct {
  id: string;
  title: string;
  brand: string;
  category: 'Dresses' | 'Tops' | 'Bags' | 'Shoes' | 'Jewellery';
  price: number;
  rating: number;
  stock: number;
  description: string;
  image: string;
  featured?: boolean;
}

export const BELLI_CATEGORIES = ['All', 'Dresses', 'Tops', 'Bags', 'Shoes', 'Jewellery'] as const;

export const HARDCODED_PRODUCTS: HardcodedProduct[] = [
  {
    id: '1',
    title: 'Rose Silk Slip Dress',
    brand: 'Belli Atelier',
    category: 'Dresses',
    price: 185,
    rating: 4.9,
    stock: 8,
    featured: true,
    description:
      'Bias-cut blush silk midi dress with delicate spaghetti straps and a luminous satin drape.',
    image:
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    title: 'Pearl Satin Corset Top',
    brand: 'Belli Studio',
    category: 'Tops',
    price: 92,
    rating: 4.8,
    stock: 14,
    featured: true,
    description:
      'Structured ivory-pink satin bodice with subtle boning and soft sweetheart neckline.',
    image:
      'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    title: 'Quilted Blush Mini Bag',
    brand: 'Belli Leather',
    category: 'Bags',
    price: 240,
    rating: 5.0,
    stock: 5,
    featured: true,
    description:
      'Soft calfskin quilted crossbody in rose quartz with rose-gold chain strap.',
    image:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '4',
    title: 'Strappy Champagne Heels',
    brand: 'Belli Footwear',
    category: 'Shoes',
    price: 155,
    rating: 4.7,
    stock: 11,
    description:
      'Minimalist square-toe heeled sandals in metallic rose-champagne finish.',
    image:
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '5',
    title: 'Cashmere Ribbed Cardigan',
    brand: 'Belli Atelier',
    category: 'Tops',
    price: 138,
    rating: 4.9,
    stock: 9,
    description:
      'Featherlight cropped knit cardigan in soft petal pink with mother-of-pearl buttons.',
    image:
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '6',
    title: 'Rose Quartz Drop Earrings',
    brand: 'Belli Bijoux',
    category: 'Jewellery',
    price: 68,
    rating: 4.8,
    stock: 20,
    description:
      'Delicate 18k rose-gold plated earrings set with faceted blush quartz.',
    image:
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
  },
];

export const HARDCODED_BAG = [
  { product: HARDCODED_PRODUCTS[0], size: 'S', quantity: 1 },
  { product: HARDCODED_PRODUCTS[2], size: 'One Size', quantity: 1 },
];

export const HARDCODED_USER = {
  name: 'Sofia Bellini',
  email: 'sofia@belli.style',
  membership: 'Atelier VIP',
  savedCount: 12,
  ordersCount: 4,
};
