import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Link, Stack, useLocalSearchParams } from 'expo-router';

import { BelliButton } from '@/components/belli-ui';
import { HARDCODED_PRODUCTS } from '@/data/mock-clothes';
import { radius, spacing, typography, useBelliColors } from '@/theme';

const SIZES = ['XS', 'S', 'M', 'L', 'XL'] as const;

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useBelliColors();

  const product =
    HARDCODED_PRODUCTS.find((item) => item.id === id) ?? HARDCODED_PRODUCTS[0];

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
            <View
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
              <Text style={{ fontSize: 20, color: colors.accent }}>♡</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
            <Text style={[typography.screenTitle, { color: colors.accent }]}>
              ${product.price.toFixed(2)}
            </Text>
            <View
              style={{
                paddingHorizontal: spacing.sm + 2,
                paddingVertical: 4,
                borderRadius: radius.pill,
                backgroundColor: colors.successTint,
              }}>
              <Text style={[typography.caption, { color: colors.success, fontWeight: '700' }]}>
                {product.stock} in stock
              </Text>
            </View>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>
              ★ {product.rating.toFixed(1)}
            </Text>
          </View>

          <View style={{ gap: spacing.xs }}>
            <Text style={[typography.caption, { color: colors.textSecondary, fontWeight: '700' }]}>
              Select Size
            </Text>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              {SIZES.map((size, idx) => {
                const active = idx === 2;
                return (
                  <View
                    key={size}
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
                  </View>
                );
              })}
            </View>
          </View>

          <Text style={[typography.body, { color: colors.textSecondary }]}>
            {product.description}
          </Text>

          <BelliButton title="Add Size M to Bag" onPress={() => {}} />

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
              onPress={() => {}}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </ScrollView>
    </>
  );
}
