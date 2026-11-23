import React from 'react';
import { KeyboardAvoidingView, ScrollView, Switch, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { Image } from 'expo-image';

import { BelliButton, BelliInput } from '@/components/belli-ui';
import { BELLI_CATEGORIES, HARDCODED_PRODUCTS, HardcodedProduct } from '@/data/mock-clothes';
import { radius, spacing, typography, useBelliColors } from '@/theme';

export function ProductForm({
  mode,
  initialProduct,
}: {
  mode: 'create' | 'edit';
  initialProduct?: HardcodedProduct;
}) {
  const colors = useBelliColors();
  const sample = initialProduct ?? HARDCODED_PRODUCTS[0];
  const categories = BELLI_CATEGORIES.filter((c) => c !== 'All');

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={process.env.EXPO_OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl }}
        keyboardShouldPersistTaps="handled">
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.md,
            backgroundColor: colors.surface,
            padding: spacing.md,
            borderRadius: radius.lg,
            borderWidth: 1,
            borderColor: colors.border,
          }}>
          <Image
            source={{ uri: sample.image }}
            style={{
              width: 84,
              height: 100,
              borderRadius: radius.md,
              backgroundColor: colors.surfaceElevated,
            }}
            contentFit="cover"
          />
          <View style={{ flex: 1, gap: spacing.xs }}>
            <Text style={[typography.cardTitle, { color: colors.text }]}>Garment Photo</Text>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>
              Static preview image
            </Text>
            <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: 4 }}>
              <View
                style={{
                  paddingHorizontal: spacing.sm + 4,
                  paddingVertical: spacing.xs + 2,
                  borderRadius: radius.pill,
                  backgroundColor: colors.accentTint,
                }}>
                <Text style={[typography.caption, { color: colors.accent, fontWeight: '700' }]}>
                  Camera
                </Text>
              </View>
              <View
                style={{
                  paddingHorizontal: spacing.sm + 4,
                  paddingVertical: spacing.xs + 2,
                  borderRadius: radius.pill,
                  backgroundColor: colors.surfaceMuted,
                }}>
                <Text style={[typography.caption, { color: colors.text, fontWeight: '600' }]}>
                  Gallery
                </Text>
              </View>
            </View>
          </View>
        </View>

        <BelliInput
          label="Piece Title"
          placeholder="Rose Silk Slip Dress"
          defaultValue={initialProduct?.title ?? ''}
        />

        <BelliInput
          label="Atelier / Brand"
          placeholder="Belli Atelier"
          defaultValue={initialProduct?.brand ?? 'Belli Atelier'}
        />

        <View style={{ gap: spacing.xs }}>
          <Text style={[typography.caption, { color: colors.textSecondary, fontWeight: '600' }]}>
            Category
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: spacing.xs }}>
            {categories.map((cat, idx) => {
              const selected = initialProduct ? initialProduct.category === cat : idx === 0;
              return (
                <View
                  key={cat}
                  style={{
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.xs + 3,
                    borderRadius: radius.pill,
                    backgroundColor: selected ? colors.accent : colors.surface,
                    borderWidth: 1,
                    borderColor: selected ? colors.accent : colors.border,
                  }}>
                  <Text
                    style={[
                      typography.caption,
                      {
                        color: selected ? colors.onAccent : colors.textSecondary,
                        fontWeight: selected ? '700' : '500',
                      },
                    ]}>
                    {cat}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        </View>

        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <View style={{ flex: 1 }}>
            <BelliInput
              label="Price (USD)"
              placeholder="185"
              defaultValue={initialProduct ? String(initialProduct.price) : '185'}
            />
          </View>
          <View style={{ flex: 1 }}>
            <BelliInput
              label="Stock Units"
              placeholder="8"
              defaultValue={initialProduct ? String(initialProduct.stock) : '8'}
            />
          </View>
        </View>

        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: colors.border,
            padding: spacing.md,
            gap: spacing.xs,
          }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={[typography.caption, { color: colors.textSecondary, fontWeight: '600' }]}>
              Quick Price Slider
            </Text>
            <Text style={[typography.caption, { color: colors.accent, fontWeight: '700' }]}>
              ${sample.price}
            </Text>
          </View>
          <Slider
            minimumValue={15}
            maximumValue={500}
            value={sample.price}
            minimumTrackTintColor={colors.accent}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.accent}
          />
        </View>

        <BelliInput
          label="Editorial Description"
          placeholder="Describe fabric, silhouette, and styling notes..."
          multiline
          numberOfLines={4}
          defaultValue={initialProduct?.description ?? ''}
          style={{ minHeight: 96, textAlignVertical: 'top' }}
        />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: colors.surface,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: colors.border,
            padding: spacing.md,
          }}>
          <View style={{ flex: 1, paddingRight: spacing.md }}>
            <Text style={[typography.cardTitle, { color: colors.text }]}>
              Feature in Belli Edit
            </Text>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>
              Highlight this piece with a boutique badge
            </Text>
          </View>
          <Switch
            value={true}
            onValueChange={() => {}}
            trackColor={{ false: colors.border, true: colors.accentSoft }}
            thumbColor={colors.accent}
          />
        </View>

        <BelliButton
          title={mode === 'create' ? 'Publish to Boutique' : 'Save Changes'}
          onPress={() => {}}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
