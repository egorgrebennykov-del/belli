const PRINTIFY_API = 'https://api.printify.com/v1';

function getConfig() {
  const token = process.env.PRINTIFY_API_TOKEN;
  const shopId = process.env.PRINTIFY_SHOP_ID || '29931979';
  if (!token) {
    throw new Error('PRINTIFY_API_TOKEN is not configured in .env.local');
  }
  return { token, shopId };
}

export async function POST(request: Request) {
  try {
    const { token, shopId } = getConfig();
    const body = await request.json();

    const res = await fetch(`${PRINTIFY_API}/shops/${shopId}/orders.json`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return Response.json(
        { error: data?.message || `Printify order error (${res.status})`, details: data },
        { status: res.status }
      );
    }

    return Response.json({ ok: true, order: data });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : 'Printify order error' },
      { status: 500 }
    );
  }
}
