import { BoutiqueProduct } from '@/services/nhost';

export interface PrintifyShopStatus {
  connected: boolean;
  shop: {
    id: number;
    title: string;
    sales_channel: string;
  } | null;
  error?: string;
}

export async function fetchPrintifyShopStatus(): Promise<PrintifyShopStatus> {
  try {
    const res = await fetch('/api/printify/shop');
    if (!res.ok) {
      return { connected: false, shop: null, error: `HTTP ${res.status}` };
    }
    return (await res.json()) as PrintifyShopStatus;
  } catch {
    return { connected: false, shop: null };
  }
}

export async function fetchPrintifyProducts(): Promise<BoutiqueProduct[]> {
  try {
    const res = await fetch('/api/printify/products', { cache: 'no-store' });
    if (!res.ok) return [];
    const data = (await res.json()) as { products?: BoutiqueProduct[] };
    return data.products ?? [];
  } catch {
    return [];
  }
}

export async function fetchPrintifyProductById(id: string): Promise<BoutiqueProduct | null> {
  try {
    const res = await fetch(`/api/printify/products?id=${encodeURIComponent(id)}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { product?: BoutiqueProduct | null };
    return data.product ?? null;
  } catch {
    return null;
  }
}

export async function createPrintifyProduct(input: {
  title: string;
  description: string;
  price: number;
  image?: string;
}): Promise<BoutiqueProduct> {
  const res = await fetch('/api/printify/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.product) {
    throw new Error(data?.error || `Printify create failed (${res.status})`);
  }
  return data.product as BoutiqueProduct;
}

export async function deletePrintifyProduct(id: string): Promise<void> {
  const res = await fetch(`/api/printify/products?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || `Printify delete failed (${res.status})`);
  }
}
