import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';

import { BelliStateView } from '@/components/belli-ui';
import { ProductForm } from '@/components/product-form';
import { useAuth } from '@/context/auth-context';
import { fetchNhostProductById } from '@/services/nhost';

export default function EditProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { accessToken } = useAuth();

  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['nhost-product', id],
    queryFn: () => fetchNhostProductById(accessToken, String(id)),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <BelliStateView
        mode="loading"
        title="Loading Piece"
        message="Preparing garment details for editing..."
      />
    );
  }

  if (error) {
    return (
      <BelliStateView
        mode="error"
        title="Could not load piece"
        message={error instanceof Error ? error.message : 'Please try again.'}
        actionLabel="Retry"
        onAction={() => refetch()}
      />
    );
  }

  if (!product) {
    return (
      <BelliStateView
        mode="empty"
        title="Piece Not Found"
        message="Unable to locate this item in Nhost."
      />
    );
  }

  return <ProductForm mode="edit" initialProduct={product} />;
}
