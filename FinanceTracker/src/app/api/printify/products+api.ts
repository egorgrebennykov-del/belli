const PRINTIFY_API = 'https://api.printify.com/v1';

function getToken() {
  const token = process.env.PRINTIFY_API_TOKEN;
  if (!token) {
    throw new Error('PRINTIFY_API_TOKEN is not configured in .env.local');
  }
  return token;
}

function getDefaultShopId() {
  return process.env.PRINTIFY_SHOP_ID || '29931979';
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

export async function POST(request: Request) {
  try {
    const token = getToken();
    const shopId = getDefaultShopId();
    const body = (await request.json()) as {
      title: string;
      description: string;
      price: number;
      image?: string;
    };

    const imageUrl =
      body.image && body.image.startsWith('http')
        ? body.image
        : 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80';

    // 1. Upload image to Printify Media Library
    const uploadRes = await fetch(`${PRINTIFY_API}/uploads/images.json`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file_name: `wavie-${Date.now()}.jpg`,
        url: imageUrl,
      }),
    });

    const uploadData = await uploadRes.json().catch(() => ({}));
    if (!uploadRes.ok || !uploadData?.id) {
      return Response.json(
        { error: uploadData?.message || 'Failed to upload image to Printify', details: uploadData },
        { status: uploadRes.status || 400 }
      );
    }

    // 2. Create Hoodie product on Printify (Blueprint 92: Unisex College Hoodie, Provider 72: Print Clever)
    const priceCents = Math.max(100, Math.round((Number(body.price) || 98) * 100));
    const variantIds = [34057, 34058, 34060, 34061];

    const createRes = await fetch(`${PRINTIFY_API}/shops/${shopId}/products.json`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: body.title.trim(),
        description: body.description.trim(),
        blueprint_id: 92,
        print_provider_id: 72,
        variants: variantIds.map((id) => ({
          id,
          price: priceCents,
          is_enabled: true,
        })),
        print_areas: [
          {
            variant_ids: variantIds,
            placeholders: [
              {
                position: 'front',
                images: [
                  {
                    id: uploadData.id,
                    x: 0.5,
                    y: 0.5,
                    scale: 1,
                    angle: 0,
                  },
                ],
              },
            ],
          },
        ],
      }),
    });

    const created = await createRes.json().catch(() => ({}));
    if (!createRes.ok) {
      return Response.json(
        { error: created?.message || 'Failed to create product in Printify', details: created },
        { status: createRes.status }
      );
    }

    return Response.json({ product: mapPrintifyProduct(created as PrintifyProduct) }, { status: 201 });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : 'Printify create error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const token = getToken();
    const shopId = getDefaultShopId();
    const url = new URL(request.url);
    const id = url.searchParams.get('id')?.replace(/^printify-/, '');

    if (!id) {
      return Response.json({ error: 'Missing product id' }, { status: 400 });
    }

    const res = await fetch(`${PRINTIFY_API}/shops/${shopId}/products/${id}.json`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      return Response.json({ error: `Printify delete error (${res.status})` }, { status: res.status });
    }

    return Response.json({ deleted: true, id });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : 'Printify delete error' },
      { status: 500 }
    );
  }
}
