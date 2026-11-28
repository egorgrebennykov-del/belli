import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

const XML_PATH = process.argv[2] || 'c:/Users/testuser/Downloads/products.xml';
const OUT_PATH = path.resolve('nhost_seed_from_xml.sql');
const MAX_PER_CATEGORY = 15;

function mapCategory(categoryPath) {
  const lower = categoryPath.toLowerCase();
  if (lower.includes('рокли')) return 'Dresses';
  if (
    lower.includes('блузи') ||
    lower.includes('ризи') ||
    lower.includes('якета') ||
    lower.includes('палта') ||
    lower.includes('пуловери') ||
    lower.includes('суитшърти')
  ) {
    return 'Tops';
  }
  if (lower.includes('панталони') && lower.includes('дрехи')) return 'Bottoms';
  if (lower.includes('пола')) return 'Bottoms';
  if (lower.includes('чанти') || lower.includes('аксесоари')) return 'Accessories';
  return null;
}

function cleanDescription(raw) {
  if (!raw) return 'Curated piece from the Belli boutique collection.';
  const beforeTable = raw.split("<div class='prod_data'>")[0];
  const stripped = beforeTable
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const text = stripped || 'Curated piece from the Belli boutique collection.';
  return text.length > 360 ? `${text.slice(0, 357)}...` : text;
}

function sqlEscape(str) {
  return String(str).replace(/'/g, "''");
}

function extractCdata(block, tag) {
  const re = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[(.*?)\\]\\]><\\/${tag}>`, 's');
  const m = block.match(re);
  if (m) return m[1].trim();
  const plain = block.match(new RegExp(`<${tag}[^>]*>(.*?)<\\/${tag}>`, 's'));
  return plain ? plain[1].trim() : '';
}

async function main() {
  if (!fs.existsSync(XML_PATH)) {
    console.error(`XML file not found: ${XML_PATH}`);
    process.exit(1);
  }

  const counts = {
    Dresses: 0,
    Tops: 0,
    Bottoms: 0,
    Accessories: 0,
  };
  const items = [];

  const rl = readline.createInterface({
    input: fs.createReadStream(XML_PATH, { encoding: 'utf8' }),
    crlfDelay: Infinity,
  });

  let currentBlock = '';
  let insideProduct = false;

  for await (const line of rl) {
    if (line.includes('<product ')) {
      insideProduct = true;
      currentBlock = line + '\n';
      continue;
    }

    if (insideProduct) {
      currentBlock += line + '\n';
      if (line.includes('</product>')) {
        insideProduct = false;

        const categoryPath = extractCdata(currentBlock, 'category_path');
        const category = mapCategory(categoryPath);
        if (category && counts[category] < MAX_PER_CATEGORY) {
          const title = extractCdata(currentBlock, 'name');
          const brand = extractCdata(currentBlock, 'brand') || 'Belli Atelier';
          const priceNum = Number.parseFloat(extractCdata(currentBlock, 'price'));
          const imageMatch = currentBlock.match(/<image_url>(https?:\/\/[^<]+)<\/image_url>/);
          const image = imageMatch ? imageMatch[1].trim() : '';

          const stockMatches = [...currentBlock.matchAll(/<STOCK>(\d+)<\/STOCK>/g)];
          const totalStock = stockMatches.reduce((sum, m) => sum + Number(m[1]), 0);

          if (title && image && Number.isFinite(priceNum) && priceNum > 0) {
            const description = cleanDescription(extractCdata(currentBlock, 'description'));
            counts[category] += 1;
            items.push({
              title,
              brand,
              category,
              price: priceNum.toFixed(2),
              rating: (4.6 + (items.length % 5) * 0.1).toFixed(1),
              stock: totalStock > 0 ? totalStock : 5,
              description,
              image,
              featured: counts[category] <= 2,
            });
          }
        }

        currentBlock = '';
        if (Object.values(counts).every((c) => c >= MAX_PER_CATEGORY)) {
          rl.close();
          break;
        }
      }
    }
  }

  const valuesSql = items
    .map(
      (item) =>
        `  ('${sqlEscape(item.title)}', '${sqlEscape(item.brand)}', '${sqlEscape(item.category)}', ${item.price}, ${item.rating}, ${item.stock}, '${sqlEscape(item.description)}', '${sqlEscape(item.image)}', ${item.featured})`
    )
    .join(',\n');

  const sql = `-- Generated from products.xml (${items.length} curated items)
-- Run in Nhost Dashboard -> Database -> SQL Editor

DROP TABLE IF EXISTS public.products CASCADE;

CREATE TABLE public.products (
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
${valuesSql};
`;

  fs.writeFileSync(OUT_PATH, sql, 'utf8');
  console.log('Generated:', OUT_PATH);
  console.log('Category counts:', counts, 'Total:', items.length);
}

main();
