import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';

import { HardcodedProduct } from '@/data/mock-clothes';
import { radius, spacing, typography, useBelliColors } from '@/theme';

export function ProductCard({ product }: { product: HardcodedProduct }) {
  const colors = useBelliColors();

  return (
    <Link
      href={{
        pathname: '/product/[id]',
        params: { id: product.id },
      }}
      asChild>
      <Pressable
        style={({ pressed }) => ({
          flex: 1,
          backgroundColor: colors.surface,
          borderRadius: radius.lg,
          borderCurve: 'continuous',
          borderWidth: 1,
          borderColor: colors.border,
          overflow: 'hidden',
          opacity: pressed ? 0.92 : 1,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.08,
          shadowRadius: 14,
          elevation: 2,
        })}>
        <View style={{ position: 'relative', backgroundColor: colors.surfaceElevated }}>
          <Image
            source={{ uri: product.image }}
            style={{ width: '100%', aspectRatio: 0.85 }}
            contentFit="cover"
          />
          <View
            style={{
              position: 'absolute',
              top: spacing.sm,
              right: spacing.sm,
              width: 32,
              height: 32,
              borderRadius: radius.pill,
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{ fontSize: 15, color: colors.accent }}>♡</Text>
          </View>
          {product.featured ? (
            <View
              style={{
                position: 'absolute',
                bottom: spacing.sm,
                left: spacing.sm,
                backgroundColor: colors.accentTint,
                borderRadius: radius.pill,
                paddingHorizontal: spacing.sm,
                paddingVertical: 3,
              }}>
              <Text style={[typography.micro, { color: colors.accent }]}>✦ Belli Edit</Text>
            </View>
          ) : null}
        </View>

        <View style={{ padding: spacing.sm + 4, gap: spacing.xs }}>
          <Text numberOfLines={1} style={[typography.micro, { color: colors.textMuted }]}>
            {product.brand}
          </Text>
          <Text
            numberOfLines={2}
            style={[typography.cardTitle, { color: colors.text, minHeight: 40 }]}>
            {product.title}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 2,
            }}>
            <Text style={[typography.price, { color: colors.accent }]}>
              ${product.price.toFixed(2)}
            </Text>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>
              ★ {product.rating.toFixed(1)}
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
