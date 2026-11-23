import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';

import { ProductCard } from '@/components/product-card';
import { HARDCODED_PRODUCTS } from '@/data/mock-clothes';
import { radius, spacing, typography, useBelliColors } from '@/theme';

export default function CollectionScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const categoryName = slug || 'All';
  const colors = useBelliColors();

  const items =
    categoryName === 'All'
      ? HARDCODED_PRODUCTS
      : HARDCODED_PRODUCTS.filter((p) => p.category === categoryName);

  return (
    <>
      <Stack.Screen options={{ title: `${categoryName} Lookbook` }} />
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        data={items}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: spacing.md, gap: spacing.md, flexGrow: 1 }}
        columnWrapperStyle={{ gap: spacing.md }}
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
              {items.length} hardcoded preview pieces in this capsule.
            </Text>
          </View>
        }
        renderItem={({ item }) => <ProductCard product={item} />}
      />
    </>
  );
}
