import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router';

import { BelliButton, BelliStateView } from '@/components/belli-ui';
import { useAuth } from '@/context/auth-context';
import { useBag } from '@/context/bag-context';
import { deleteNhostProduct, fetchNhostProductById } from '@/services/nhost';
import { radius, spacing, typography, useBelliColors } from '@/theme';

const SIZES = ['XS', 'S', 'M', 'L', 'XL'] as const;

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useBelliColors();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { accessToken, isAuthenticated, biometricsEnabled, authenticateWithBiometrics } = useAuth();
  const { favoriteIds, toggleFavorite, addToBag } = useBag();

  const [selectedSize, setSelectedSize] = useState<string>('M');

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

  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!accessToken) throw new Error('Authentication required');
      return deleteNhostProduct(accessToken, String(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nhost-products'] });
      router.back();
    },
    onError: (err) => {
      Alert.alert('Delete Failed', err instanceof Error ? err.message : 'Please try again.');
    },
  });

  const handleDelete = async () => {
    if (biometricsEnabled) {
      const ok = await authenticateWithBiometrics();
      if (!ok) return;
    }

    Alert.alert('Remove Piece', `Remove "${product?.title}" from Nhost database?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteMutation.mutate() },
    ]);
  };

  if (isLoading) {
    return (
      <BelliStateView
        mode="loading"
        title="Loading Piece"
        message="Fetching garment details from Nhost..."
      />
    );
  }

  if (error) {
    return (
      <BelliStateView
        mode="error"
        title="Piece Unavailable"
        message={error instanceof Error ? error.message : 'Could not load this garment.'}
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
        message="This item may have been deleted from the database."
        actionLabel="Back to Boutique"
        onAction={() => router.back()}
      />
    );
  }

  const isFavorite = favoriteIds.includes(product.id);

  return (
    <>
      <Stack.Screen options={{ title: product.title }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingBottom: spacing.xxl, gap: spacing.lg }}>
        <View style={{ backgroundColor: colors.surfaceElevated }}>
          <Image
            source={{ uri: product.image }}
            style={{ width: '100%', aspectRatio: 0.92 }}
            contentFit="cover"
            transition={250}
          />
        </View>

        <View style={{ paddingHorizontal: spacing.lg, gap: spacing.md }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: spacing.md,
            }}>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={[typography.micro, { color: colors.accent }]}>
                {product.brand} · {product.category}
              </Text>
              <Text selectable style={[typography.screenTitle, { color: colors.text }]}>
                {product.title}
              </Text>
            </View>
            <Pressable
              onPress={() => {
                if (process.env.EXPO_OS === 'ios') {
                  Haptics.selectionAsync().catch(() => {});
                }
                toggleFavorite(product.id);
              }}
              style={{
                width: 44,
                height: 44,
                borderRadius: radius.pill,
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{ fontSize: 20, color: isFavorite ? colors.accent : colors.textMuted }}>
                {isFavorite ? '♥' : '♡'}
              </Text>
            </Pressable>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
            <Text style={[typography.screenTitle, { color: colors.accent }]}>
              ${Number(product.price).toFixed(2)}
            </Text>
            <View
              style={{
                paddingHorizontal: spacing.sm + 2,
                paddingVertical: 4,
                borderRadius: radius.pill,
                backgroundColor: product.stock > 0 ? colors.successTint : colors.dangerTint,
              }}>
              <Text
                style={[
                  typography.caption,
                  { color: product.stock > 0 ? colors.success : colors.danger, fontWeight: '700' },
                ]}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Sold out'}
              </Text>
            </View>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>
              ★ {Number(product.rating).toFixed(1)}
            </Text>
          </View>

          <View style={{ gap: spacing.xs }}>
            <Text style={[typography.caption, { color: colors.textSecondary, fontWeight: '700' }]}>
              Select Size
            </Text>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              {SIZES.map((size) => {
                const active = selectedSize === size;
                return (
                  <Pressable
                    key={size}
                    onPress={() => setSelectedSize(size)}
                    style={{
                      minWidth: 46,
                      height: 42,
                      borderRadius: radius.md,
                      borderWidth: 1,
                      borderColor: active ? colors.accent : colors.border,
                      backgroundColor: active ? colors.accent : colors.surface,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={[
                        typography.caption,
                        { color: active ? colors.onAccent : colors.text, fontWeight: '700' },
                      ]}>
                      {size}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Text style={[typography.body, { color: colors.textSecondary }]}>
            {product.description}
          </Text>

          <BelliButton
            title={`Add Size ${selectedSize} to Bag`}
            disabled={product.stock <= 0}
            onPress={() => {
              addToBag(product, selectedSize);
              Alert.alert('Added to Bag ✦', `${product.title} (${selectedSize}) is in your bag.`);
            }}
          />

          {isAuthenticated ? (
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <Link
                href={{
                  pathname: '/product/edit/[id]',
                  params: { id: product.id },
                }}
                asChild>
                <BelliButton
                  title="Edit Piece"
                  variant="secondary"
                  onPress={() => {}}
                  style={{ flex: 1 }}
                />
              </Link>
              <BelliButton
                title="Delete"
                variant="danger"
                loading={deleteMutation.isPending}
                onPress={handleDelete}
                style={{ flex: 1 }}
              />
            </View>
          ) : null}
        </View>
      </ScrollView>
    </>
  );
}
