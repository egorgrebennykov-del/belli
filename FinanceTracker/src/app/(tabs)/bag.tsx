import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BelliButton } from '@/components/belli-ui';
import { HARDCODED_BAG } from '@/data/mock-clothes';
import { radius, spacing, typography, useBelliColors } from '@/theme';

export default function BagScreen() {
  const colors = useBelliColors();
  const subtotal = HARDCODED_BAG.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <View
        style={{
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm + 4,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View>
          <Text style={[typography.screenTitle, { color: colors.text }]}>Shopping Bag</Text>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>
            {HARDCODED_BAG.length} curated pieces
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.md, gap: spacing.md }}>
        {HARDCODED_BAG.map((entry) => (
          <View
            key={`${entry.product.id}-${entry.size}`}
            style={{
              flexDirection: 'row',
              backgroundColor: colors.surface,
              borderRadius: radius.lg,
              borderCurve: 'continuous',
              borderWidth: 1,
              borderColor: colors.border,
              padding: spacing.sm + 4,
              gap: spacing.md,
              alignItems: 'center',
            }}>
            <Link
              href={{
                pathname: '/product/[id]',
                params: { id: entry.product.id },
              }}
              asChild>
              <Pressable>
                <Image
                  source={{ uri: entry.product.image }}
                  style={{
                    width: 78,
                    height: 92,
                    borderRadius: radius.md,
                    backgroundColor: colors.surfaceElevated,
                  }}
                  contentFit="cover"
                />
              </Pressable>
            </Link>

            <View style={{ flex: 1, gap: spacing.xs }}>
              <Text numberOfLines={2} style={[typography.cardTitle, { color: colors.text }]}>
                {entry.product.title}
              </Text>
              <Text style={[typography.caption, { color: colors.textSecondary }]}>
                Size: {entry.size}
              </Text>
              <Text style={[typography.price, { color: colors.accent }]}>
                ${entry.product.price.toFixed(2)}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: radius.pill,
                  backgroundColor: colors.surfaceMuted,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{ color: colors.text, fontWeight: '700' }}>−</Text>
              </View>
              <Text style={[typography.cardTitle, { color: colors.text }]}>{entry.quantity}</Text>
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: radius.pill,
                  backgroundColor: colors.accentTint,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{ color: colors.accent, fontWeight: '700' }}>+</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View
        style={{
          padding: spacing.md,
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          gap: spacing.sm,
        }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={[typography.body, { color: colors.textSecondary }]}>Subtotal</Text>
          <Text style={[typography.sectionTitle, { color: colors.text }]}>
            ${subtotal.toFixed(2)}
          </Text>
        </View>
        <BelliButton title="Complete Boutique Order" onPress={() => {}} />
      </View>
    </SafeAreaView>
  );
}
