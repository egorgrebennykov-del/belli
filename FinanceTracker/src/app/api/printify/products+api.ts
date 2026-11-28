const PRINTIFY_API = 'https://api.printify.com/v1';

function getConfig() {
  const token = process.env.PRINTIFY_API_TOKEN;
  const shopId = process.env.PRINTIFY_SHOP_ID || '29931979';
  if (!token) {
    throw new Error('PRINTIFY_API_TOKEN is not configured in .env.local');
  }
  return { token, shopId };
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

export async function GET() {
  try {
    const { token, shopId } = getConfig();
    const res = await fetch(`${PRINTIFY_API}/shops/${shopId}/products.json?limit=50`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      return Response.json(
        { error: `Printify products error (${res.status})` },
        { status: res.status }
      );
    }

    const payload = (await res.json()) as { data?: PrintifyProduct[] };
    const products = (payload.data ?? []).map((item) => {
      const enabledVariant =
        item.variants?.find((v) => v.is_enabled && v.is_available) ?? item.variants?.[0];
      const defaultImage =
        item.images?.find((img) => img.is_default)?.src ?? item.images?.[0]?.src ?? '';

      return {
        id: item.id,
        title: item.title,
        brand: 'Wavie × Printify',
        category: 'Oversized',
        price: enabledVariant ? Number((enabledVariant.price / 100).toFixed(2)) : 89,
        rating: 4.9,
        stock: 25,
        description: item.description?.replace(/<[^>]+>/g, ' ').trim() || 'Printify custom hoodie.',
        image: defaultImage,
        featured: true,
        created_at: item.created_at,
      };
    });

    return Response.json({ shopId, products });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : 'Printify products error' },
      { status: 500 }
    );
  }
}
