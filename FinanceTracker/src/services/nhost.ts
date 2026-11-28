import { XML_CATALOG } from '@/data/xml-catalog';

const SUBDOMAIN = process.env.EXPO_PUBLIC_NHOST_SUBDOMAIN || 'ylllixqgmpirlkpdujwc';
const REGION = process.env.EXPO_PUBLIC_NHOST_REGION || 'eu-central-1';

export const NHOST_AUTH_URL =
  process.env.EXPO_PUBLIC_NHOST_AUTH_URL ||
  `https://${SUBDOMAIN}.auth.${REGION}.nhost.run/v1`;

export const NHOST_GRAPHQL_URL =
  process.env.EXPO_PUBLIC_NHOST_GRAPHQL_URL ||
  `https://${SUBDOMAIN}.graphql.${REGION}.nhost.run/v1`;

export interface NhostUser {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
}

export interface NhostSession {
  accessToken: string;
  refreshToken: string;
  user: NhostUser;
}

export interface BoutiqueProduct {
  id: string;
  title: string;
  brand: string;
  category: 'Dresses' | 'Tops' | 'Bottoms' | 'Accessories' | 'Lingerie';
  price: number;
  rating: number;
  stock: number;
  description: string;
  image: string;
  featured: boolean;
  created_at?: string;
}

export type ProductInput = Omit<BoutiqueProduct, 'id' | 'rating' | 'created_at'>;

export const BELLI_CATEGORIES = [
  'All',
  'Dresses',
  'Tops',
  'Bottoms',
  'Accessories',
  'Lingerie',
] as const;

async function authRequest<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${NHOST_AUTH_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || data?.error || `Auth error (${res.status})`);
  }
  return data as T;
}

interface NhostAuthResponse {
  session: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      displayName?: string;
      avatarUrl?: string;
    };
  } | null;
}

export async function nhostSignIn(email: string, password: string): Promise<NhostSession> {
  const data = await authRequest<NhostAuthResponse>('/signin/email-password', {
    email: email.trim().toLowerCase(),
    password,
  });

  if (!data.session) {
    throw new Error('Please verify your email before signing in.');
  }

  return {
    accessToken: data.session.accessToken,
    refreshToken: data.session.refreshToken,
    user: {
      id: data.session.user.id,
      email: data.session.user.email,
      displayName: data.session.user.displayName || data.session.user.email.split('@')[0],
      avatarUrl: data.session.user.avatarUrl,
    },
  };
}

export async function nhostSignUp(input: {
  email: string;
  password: string;
  displayName: string;
}): Promise<{ session: NhostSession | null; verificationRequired: boolean }> {
  const data = await authRequest<NhostAuthResponse>('/signup/email-password', {
    email: input.email.trim().toLowerCase(),
    password: input.password,
    options: {
      displayName: input.displayName.trim(),
    },
  });

  if (!data.session) {
    return { session: null, verificationRequired: true };
  }

  return {
    verificationRequired: false,
    session: {
      accessToken: data.session.accessToken,
      refreshToken: data.session.refreshToken,
      user: {
        id: data.session.user.id,
        email: data.session.user.email,
        displayName: data.session.user.displayName || input.displayName.trim(),
        avatarUrl: data.session.user.avatarUrl,
      },
    },
  };
}

export async function nhostRefreshSession(refreshToken: string): Promise<NhostSession> {
  const data = await authRequest<{
    accessToken: string;
    refreshToken: string;
    user: { id: string; email: string; displayName?: string; avatarUrl?: string };
  }>('/token', { refreshToken });

  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    user: {
      id: data.user.id,
      email: data.user.email,
      displayName: data.user.displayName || data.user.email.split('@')[0],
      avatarUrl: data.user.avatarUrl,
    },
  };
}

export async function nhostSignOut(refreshToken?: string): Promise<void> {
  if (!refreshToken) return;
  await fetch(`${NHOST_AUTH_URL}/signout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  }).catch(() => {});
}

async function graphqlRequest<T>(
  query: string,
  variables: Record<string, unknown>,
  accessToken?: string
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const res = await fetch(NHOST_GRAPHQL_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();
  if (!res.ok || json.errors?.length) {
    const msg = json.errors?.[0]?.message || `GraphQL request failed (${res.status})`;
    throw new Error(msg);
  }

  return json.data as T;
}

const PRODUCT_FIELDS = `
  id
  title
  brand
  category
  price
  rating
  stock
  description
  image
  featured
  created_at
`;

function filterLocalCatalog(category: string, search: string): BoutiqueProduct[] {
  const q = search.trim().toLowerCase();
  return XML_CATALOG.filter((item) => {
    const matchesCat = !category || category === 'All' || item.category === category;
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.brand.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });
}

export async function fetchNhostProducts(
  accessToken: string | undefined,
  category: string = 'All',
  search: string = ''
): Promise<BoutiqueProduct[]> {
  try {
    const where: Record<string, unknown> = {};
    if (category && category !== 'All') {
      where.category = { _eq: category };
    }
    if (search.trim().length > 0) {
      where.title = { _ilike: `%${search.trim()}%` };
    }

    const query = `
      query GetProducts($where: products_bool_exp) {
        products(where: $where, order_by: { created_at: desc }) {
          ${PRODUCT_FIELDS}
        }
      }
    `;

    const data = await graphqlRequest<{ products: BoutiqueProduct[] }>(
      query,
      { where },
      accessToken
    );
    if (data.products.length > 0) {
      return data.products;
    }
    return filterLocalCatalog(category, search);
  } catch {
    return filterLocalCatalog(category, search);
  }
}

export async function fetchNhostProductById(
  accessToken: string | undefined,
  id: string
): Promise<BoutiqueProduct | null> {
  if (id.startsWith('xml-')) {
    return XML_CATALOG.find((item) => item.id === id) ?? null;
  }

  try {
    const query = `
      query GetProductById($id: uuid!) {
        products_by_pk(id: $id) {
          ${PRODUCT_FIELDS}
        }
      }
    `;

    const data = await graphqlRequest<{ products_by_pk: BoutiqueProduct | null }>(
      query,
      { id },
      accessToken
    );
    return data.products_by_pk ?? XML_CATALOG.find((item) => item.id === id) ?? null;
  } catch {
    return XML_CATALOG.find((item) => item.id === id) ?? null;
  }
}

export async function createNhostProduct(
  accessToken: string,
  input: ProductInput
): Promise<BoutiqueProduct> {
  const query = `
    mutation InsertProduct($object: products_insert_input!) {
      insert_products_one(object: $object) {
        ${PRODUCT_FIELDS}
      }
    }
  `;

  const data = await graphqlRequest<{ insert_products_one: BoutiqueProduct }>(
    query,
    { object: input },
    accessToken
  );
  return data.insert_products_one;
}

export async function updateNhostProduct(
  accessToken: string,
  id: string,
  input: Partial<ProductInput>
): Promise<BoutiqueProduct> {
  const query = `
    mutation UpdateProduct($id: uuid!, $set: products_set_input!) {
      update_products_by_pk(pk_columns: { id: $id }, _set: $set) {
        ${PRODUCT_FIELDS}
      }
    }
  `;

  const data = await graphqlRequest<{ update_products_by_pk: BoutiqueProduct }>(
    query,
    { id, set: input },
    accessToken
  );
  return data.update_products_by_pk;
}

export async function deleteNhostProduct(accessToken: string, id: string): Promise<void> {
  const query = `
    mutation DeleteProduct($id: uuid!) {
      delete_products_by_pk(id: $id) {
        id
      }
    }
  `;

  await graphqlRequest(query, { id }, accessToken);
}
