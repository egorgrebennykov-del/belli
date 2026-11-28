const PRINTIFY_API = 'https://api.printify.com/v1';

function getToken() {
  const token = process.env.PRINTIFY_API_TOKEN;
  if (!token) {
    throw new Error('PRINTIFY_API_TOKEN is not configured in .env.local');
  }
  return token;
}

interface PrintifyProduct {
  id: string;
  title: string;
  description: string;
  tags?: string[];
  variants?: Array<{ id: number; price: number; is_enabled: boolean; is_available: boolean }>;
  images?: Array<{ src: string; is_default?: boolean }>;
  created_at?: string;
}

function mapPrintifyProduct(item: PrintifyProduct) {
  const enabledVariant =
    item.variants?.find((v) => v.is_enabled && v.is_available) ?? item.variants?.[0];
  const defaultImage =
    item.images?.find((img) => img.is_default)?.src ?? item.images?.[0]?.src ?? '';

  return {
    id: `printify-${item.id}`,
    title: item.title,
    brand: 'Wavie × Printify',
    category: 'Oversized' as const,
    price: enabledVariant ? Number((enabledVariant.price / 100).toFixed(2)) : 89,
    rating: 4.9,
    stock: 25,
    description: item.description?.replace(/<[^>]+>/g, ' ').trim() || 'Printify custom hoodie.',
    image: defaultImage,
    featured: true,
    created_at: item.created_at,
  };
}

export async function GET(request: Request) {
  try {
    const token = getToken();
    const url = new URL(request.url);
    const singleId = url.searchParams.get('id')?.replace(/^printify-/, '');

    const shopsRes = await fetch(`${PRINTIFY_API}/shops.json`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!shopsRes.ok) {
      return Response.json(
        { error: `Printify shops error (${shopsRes.status})` },
        { status: shopsRes.status }
      );
    }

    const shops = (await shopsRes.json()) as Array<{ id: number; title: string }>;
    const allProducts: ReturnType<typeof mapPrintifyProduct>[] = [];

    for (const shop of shops) {
      if (singleId) {
        const singleRes = await fetch(
          `${PRINTIFY_API}/shops/${shop.id}/products/${singleId}.json`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (singleRes.ok) {
          const item = (await singleRes.json()) as PrintifyProduct;
          return Response.json({ product: mapPrintifyProduct(item) });
        }
        continue;
      }

      const res = await fetch(`${PRINTIFY_API}/shops/${shop.id}/products.json?limit=50`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const payload = (await res.json()) as { data?: PrintifyProduct[] };
        for (const item of payload.data ?? []) {
          allProducts.push(mapPrintifyProduct(item));
        }
      }
    }

    if (singleId) {
      return Response.json({ product: null }, { status: 404 });
    }

    return Response.json({ shops: shops.map((s) => s.id), products: allProducts });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : 'Printify products error' },
      { status: 500 }
    );
  }
}
