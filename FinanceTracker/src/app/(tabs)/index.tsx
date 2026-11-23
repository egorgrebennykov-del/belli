import React from 'react';
import { FlatList, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProductCard } from '@/components/product-card';
import { BELLI_CATEGORIES, HARDCODED_PRODUCTS } from '@/data/mock-clothes';
import { radius, spacing, typography, useBelliColors } from '@/theme';

export default function BoutiqueScreen() {
  const colors = useBelliColors();

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
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <View
              style={{
                width: 48,
                height: 34,
                borderRadius: radius.sm,
                backgroundColor: '#FFFFFF',
                borderWidth: 1,
                borderColor: colors.border,
                overflow: 'hidden',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={require('../../../assets/images/belli-logo.jpg')}
                style={{ width: '92%', height: '92%' }}
                contentFit="contain"
              />
            </View>
            <View>
              <Text style={[typography.screenTitle, { color: colors.text }]}>Belli</Text>
              <Text style={[typography.micro, { color: colors.accent }]}>
                Seasonal Atelier
              </Text>
            </View>
          </View>

          <Link href="/product/manage" asChild>
            <Pressable
              style={({ pressed }) => ({
                backgroundColor: colors.accent,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                borderRadius: radius.pill,
                opacity: pressed ? 0.85 : 1,
              })}>
              <Text style={[typography.caption, { color: colors.onAccent, fontWeight: '700' }]}>
                + Add Piece
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
            placeholder="Search dresses, silk tops, heels..."
            placeholderTextColor={colors.textMuted}
            style={{ flex: 1, color: colors.text, fontSize: 15, paddingVertical: spacing.xs }}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: spacing.xs + 2, paddingVertical: 2 }}>
          {BELLI_CATEGORIES.map((cat, index) => {
            const active = index === 0;
            return (
              <Link
                key={cat}
                href={{
                  pathname: '/collection/[slug]',
                  params: { slug: cat },
                }}
                asChild>
                <Pressable
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
              </Link>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={HARDCODED_PRODUCTS}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{
          padding: spacing.md,
          gap: spacing.md,
        }}
        columnWrapperStyle={{ gap: spacing.md }}
        ListHeaderComponent={
          <View
            style={{
              backgroundColor: colors.accentTint,
              borderRadius: radius.lg,
              borderCurve: 'continuous',
              borderWidth: 1,
              borderColor: colors.borderStrong,
              padding: spacing.md,
              gap: 4,
            }}>
            <Text style={[typography.micro, { color: colors.accent }]}>
              ✦ NEW SEASON DROP
            </Text>
            <Text style={[typography.sectionTitle, { color: colors.text }]}>
              Rose Quartz & Silk Capsule
            </Text>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>
              Handpicked silhouettes curated for the Belli boutique.
            </Text>
          </View>
        }
        renderItem={({ item }) => <ProductCard product={item} />}
      />
    </SafeAreaView>
  );
}
