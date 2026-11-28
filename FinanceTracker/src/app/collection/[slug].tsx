import React from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Stack, useLocalSearchParams } from 'expo-router';

import { BelliStateView } from '@/components/belli-ui';
import { ProductCard } from '@/components/product-card';
import { useAuth } from '@/context/auth-context';
import { useBag } from '@/context/bag-context';
import { fetchNhostProducts } from '@/services/nhost';
import { radius, spacing, typography, useBelliColors } from '@/theme';

export default function CollectionScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const categoryName = slug || 'All';

  const colors = useBelliColors();
  const { accessToken } = useAuth();
  const { favoriteIds, toggleFavorite } = useBag();

  const {
    data: products = [],
    isLoading,
    isRefetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ['nhost-collection', categoryName],
    queryFn: () => fetchNhostProducts(accessToken, categoryName, ''),
  });

  return (
    <>
      <Stack.Screen options={{ title: `${categoryName} Lookbook` }} />
      {isLoading ? (
        <BelliStateView
          mode="loading"
          title={`Loading ${categoryName}`}
          message="Fetching capsule collection from Nhost..."
        />
      ) : error ? (
        <BelliStateView
          mode="error"
          title="Could not load collection"
          message={error instanceof Error ? error.message : 'Please try again.'}
          actionLabel="Retry"
          onAction={() => refetch()}
        />
      ) : (
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ padding: spacing.md, gap: spacing.md, flexGrow: 1 }}
          columnWrapperStyle={{ gap: spacing.md }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={() => {
                refetch();
              }}
              tintColor={colors.accent}
            />
          }
          ListHeaderComponent={
            <View
              style={{
                backgroundColor: colors.accentTint,
                borderRadius: radius.lg,
                borderWidth: 1,
                borderColor: colors.borderStrong,
                padding: spacing.lg,
                gap: spacing.xs,
              }}>
              <Text style={[typography.micro, { color: colors.accent }]}>
                ✦ BELLI CAPSULE COLLECTION
              </Text>
              <Text style={[typography.screenTitle, { color: colors.text }]}>{categoryName}</Text>
              <Text style={[typography.body, { color: colors.textSecondary }]}>
                {products.length} pieces in Nhost database.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              isFavorite={favoriteIds.includes(item.id)}
              onToggleFavorite={toggleFavorite}
            />
          )}
          ListEmptyComponent={
            <BelliStateView
              mode="empty"
              title="No pieces in this capsule"
              message="Add a piece in this category or check back soon."
            />
          }
        />
      )}
    </>
  );
}
