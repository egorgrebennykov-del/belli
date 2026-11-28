-- Run this in Nhost Dashboard -> Database -> SQL Editor
-- Then in Hasura Console -> Data -> Track "products" and allow select/insert/update/delete for role "user" (and select for "public" if desired).

CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  brand text NOT NULL DEFAULT 'Belli Atelier',
  category text NOT NULL,
  price numeric(10, 2) NOT NULL CHECK (price > 0),
  rating numeric(3, 1) NOT NULL DEFAULT 4.9,
  stock integer NOT NULL DEFAULT 10 CHECK (stock >= 0),
  description text NOT NULL,
  image text NOT NULL,
  featured boolean NOT NULL DEFAULT false,
  user_id uuid NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.products (title, brand, category, price, rating, stock, description, image, featured)
VALUES
  (
    'Rose Silk Slip Dress',
    'Belli Atelier',
    'Dresses',
    185.00,
    4.9,
    8,
    'Bias-cut blush silk midi dress with delicate spaghetti straps and a luminous satin drape.',
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
    true
  ),
  (
    'Pearl Satin Corset Top',
    'Belli Studio',
    'Tops',
    92.00,
    4.8,
    14,
    'Structured ivory-pink satin bodice with subtle boning and soft sweetheart neckline.',
    'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=800&q=80',
    true
  ),
  (
    'Quilted Blush Mini Bag',
    'Belli Leather',
    'Bags',
    240.00,
    5.0,
    5,
    'Soft calfskin quilted crossbody in rose quartz with rose-gold chain strap.',
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    true
  ),
  (
    'Strappy Champagne Heels',
    'Belli Footwear',
    'Shoes',
    155.00,
    4.7,
    11,
    'Minimalist square-toe heeled sandals in metallic rose-champagne finish.',
    'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
    false
  ),
  (
    'Cashmere Ribbed Cardigan',
    'Belli Atelier',
    'Tops',
    138.00,
    4.9,
    9,
    'Featherlight cropped knit cardigan in soft petal pink with mother-of-pearl buttons.',
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80',
    false
  ),
  (
    'Rose Quartz Drop Earrings',
    'Belli Bijoux',
    'Jewellery',
    68.00,
    4.8,
    20,
    'Delicate 18k rose-gold plated earrings set with faceted blush quartz.',
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
    false
  );
