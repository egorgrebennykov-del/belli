const PRINTIFY_API = 'https://api.printify.com/v1';

function getConfig() {
  const token = process.env.PRINTIFY_API_TOKEN;
  const shopId = process.env.PRINTIFY_SHOP_ID || '29931979';
  if (!token) {
    throw new Error('PRINTIFY_API_TOKEN is not configured in .env.local');
  }
  return { token, shopId };
}

export async function GET() {
  try {
    const { token, shopId } = getConfig();
    const res = await fetch(`${PRINTIFY_API}/shops.json`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      return Response.json(
        { error: `Printify shops error (${res.status})` },
        { status: res.status }
      );
    }

    const shops = (await res.json()) as Array<{
      id: number;
      title: string;
      sales_channel: string;
    }>;
    const activeShop = shops.find((s) => String(s.id) === shopId) ?? shops[0] ?? null;

    return Response.json({ connected: true, shop: activeShop, totalShops: shops.length });
  } catch (err) {
    return Response.json(
      { connected: false, error: err instanceof Error ? err.message : 'Printify error' },
      { status: 500 }
    );
  }
}
