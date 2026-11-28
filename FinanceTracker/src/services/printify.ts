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
    const res = await fetch('/api/printify/products');
    if (!res.ok) return [];
    const data = (await res.json()) as { products?: BoutiqueProduct[] };
    return data.products ?? [];
  } catch {
    return [];
  }
}
