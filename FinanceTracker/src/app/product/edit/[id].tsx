import React from 'react';
import { useLocalSearchParams } from 'expo-router';

import { ProductForm } from '@/components/product-form';
import { HARDCODED_PRODUCTS } from '@/data/mock-clothes';

export default function EditProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = HARDCODED_PRODUCTS.find((item) => item.id === id) ?? HARDCODED_PRODUCTS[0];

  return <ProductForm mode="edit" initialProduct={product} />;
}
