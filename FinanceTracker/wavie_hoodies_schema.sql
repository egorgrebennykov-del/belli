-- Wavie Hoodie Store Schema for Nhost Postgres
-- Run in Nhost Dashboard -> Database -> SQL Editor

DROP TABLE IF EXISTS public.products CASCADE;

CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  brand text NOT NULL DEFAULT 'Wavie Core',
  category text NOT NULL,
  price numeric(10, 2) NOT NULL CHECK (price > 0),
  rating numeric(3, 1) NOT NULL DEFAULT 4.9,
  stock integer NOT NULL DEFAULT 12 CHECK (stock >= 0),
  description text NOT NULL,
  image text NOT NULL,
  featured boolean NOT NULL DEFAULT false,
  user_id uuid NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.products (title, brand, category, price, rating, stock, description, image, featured)
VALUES
  (
    'Wavie Cloud Fleece Hoodie',
    'Wavie Core',
    'Oversized',
    98.00,
    4.9,
    18,
    '480gsm brushed cotton-fleece oversized hoodie in warm cream with lavender drawcords and dropped shoulders.',
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80',
    true
  ),
  (
    'Midnight Obsidian Box Hoodie',
    'Wavie Core',
    'Heavyweight',
    112.00,
    5.0,
    12,
    'Ultra-heavy 520gsm French terry boxy hoodie in deep obsidian black with double-lined structured hood.',
    'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?auto=format&fit=crop&w=800&q=80',
    true
  ),
  (
    'Electric Lavender Zip Hoodie',
    'Wavie Studio',
    'Zip-Up',
    105.00,
    4.8,
    15,
    'Two-way metallic zipper hoodie in washed violet-lavender with ribbed cuffs and kangaroo pockets.',
    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
    true
  ),
  (
    'Starlight Graphic Pullover',
    'Wavie Drop 04',
    'Graphic',
    118.00,
    4.9,
    9,
    'Limited puff-print starlight emblem on vintage-washed charcoal fleece with relaxed streetwear drape.',
    'https://images.unsplash.com/photo-1509942774463-acf339cf87d5?auto=format&fit=crop&w=800&q=80',
    true
  ),
  (
    'Heather Ash Cropped Hoodie',
    'Wavie Studio',
    'Cropped',
    84.00,
    4.7,
    20,
    'Raw-hem cropped silhouette in soft heather grey fleece, designed for effortless layering.',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    false
  ),
  (
    'Oatmeal Heavyweight Crew-Hood',
    'Wavie Core',
    'Heavyweight',
    108.00,
    4.8,
    16,
    '500gsm organic cotton fleece in warm oatmeal cream with zero-drawcord minimalist hood.',
    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
    false
  );
