import React, { useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BelliStateView } from '@/components/belli-ui';
import { ProductCard } from '@/components/product-card';
import { useAuth } from '@/context/auth-context';
import { useBag } from '@/context/bag-context';
import { BELLI_CATEGORIES, fetchNhostProducts } from '@/services/nhost';
import { radius, spacing, typography, useBelliColors } from '@/theme';

export default function BoutiqueScreen() {
  const colors = useBelliColors();
  const { accessToken, isAuthenticated } = useAuth();
  const { favoriteIds, toggleFavorite } = useBag();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: products = [],
    isLoading,
    isRefetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ['nhost-products', selectedCategory, searchQuery.trim()],
    queryFn: () => fetchNhostProducts(accessToken, selectedCategory, searchQuery),
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <View
        style={{
          paddingHorizontal: spacing.md,
          paddingTop: spacing.xs,
          paddingBottom: spacing.sm,
          gap: spacing.sm,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          backgroundColor: colors.background,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Image
            source={require('../../../assets/images/belli-logo.png')}
            style={{ width: 150, height: 74 }}
            contentFit="contain"
          />

          <Link href={isAuthenticated ? '/product/manage' : '/(auth)/login'} asChild>
            <Pressable
              style={({ pressed }) => ({
                backgroundColor: colors.accent,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                borderRadius: radius.pill,
                opacity: pressed ? 0.85 : 1,
              })}>
              <Text style={[typography.caption, { color: colors.onAccent, fontWeight: '700' }]}>
                {isAuthenticated ? '+ Add Piece' : 'Sign In'}
              </Text>
            </Pressable>
          </Link>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.surface,
            borderRadius: radius.pill,
            borderWidth: 1,
            borderColor: colors.border,
            paddingHorizontal: spacing.md,
            minHeight: 42,
            gap: spacing.sm,
          }}>
          <Text style={{ color: colors.textMuted, fontSize: 15 }}>⌕</Text>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search dresses, silk tops, heels..."
            placeholderTextColor={colors.textMuted}
            returnKeyType="search"
            style={{ flex: 1, color: colors.text, fontSize: 15, paddingVertical: spacing.xs }}
          />
          {searchQuery.length > 0 ? (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
              <Text style={[typography.caption, { color: colors.accent, fontWeight: '700' }]}>
                Clear
              </Text>
            </Pressable>
          ) : null}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: spacing.xs + 2, paddingVertical: 2 }}>
          {BELLI_CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <Pressable
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={{
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.xs + 3,
                  borderRadius: radius.pill,
                  backgroundColor: active ? colors.accent : colors.surface,
                  borderWidth: 1,
                  borderColor: active ? colors.accent : colors.border,
                }}>
                <Text
                  style={[
                    typography.caption,
                    {
                      color: active ? colors.onAccent : colors.textSecondary,
                      fontWeight: active ? '700' : '500',
                    },
                  ]}>
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {isLoading ? (
        <BelliStateView
          mode="loading"
          title="Loading Belli Boutique"
          message="Fetching curated pieces from your Nhost database..."
        />
      ) : error ? (
        <BelliStateView
          mode="error"
          title="Database Connection Error"
          message={error instanceof Error ? error.message : 'Unable to reach Nhost GraphQL.'}
          actionLabel="Try Again"
          onAction={() => refetch()}
        />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{
            padding: spacing.md,
            gap: spacing.md,
            flexGrow: 1,
          }}
          columnWrapperStyle={{ gap: spacing.md }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={() => {
                refetch();
              }}
              tintColor={colors.accent}
              colors={[colors.accent]}
            />
          }
          ListHeaderComponent={
            selectedCategory !== 'All' ? (
              <Link
                href={{
                  pathname: '/collection/[slug]',
                  params: { slug: selectedCategory },
                }}
                asChild>
                <Pressable
                  style={{
                    backgroundColor: colors.accentTint,
                    borderRadius: radius.lg,
                    borderCurve: 'continuous',
                    borderWidth: 1,
                    borderColor: colors.borderStrong,
                    padding: spacing.md,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{ gap: 2 }}>
                    <Text style={[typography.micro, { color: colors.accent }]}>
                      ✦ EDITORIAL SPOTLIGHT
                    </Text>
                    <Text style={[typography.cardTitle, { color: colors.text }]}>
                      Open {selectedCategory} Lookbook
                    </Text>
                  </View>
                  <Text style={{ color: colors.accent, fontSize: 18, fontWeight: '700' }}>→</Text>
                </Pressable>
              </Link>
            ) : undefined
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
              title="No pieces found"
              message="Add a new garment or run nhost_schema.sql in your Nhost SQL Editor."
              actionLabel="Reset Filters"
              onAction={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}
