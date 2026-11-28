import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BelliButton, BelliStateView } from '@/components/belli-ui';
import { useBag } from '@/context/bag-context';
import { radius, spacing, typography, useBelliColors } from '@/theme';

export default function BagScreen() {
  const colors = useBelliColors();
  const { bag, bagSubtotal, updateBagQuantity, clearBag, favoriteIds } = useBag();
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleCheckout = () => {
    Alert.alert(
      'Confirm Belli Order',
      `Place boutique order for $${bagSubtotal.toFixed(2)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Place Order',
          onPress: () => {
            clearBag();
            setOrderPlaced(true);
          },
        },
      ]
    );
  };

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
            {favoriteIds.length} saved in wishlist
          </Text>
        </View>
        {bag.length > 0 ? (
          <Pressable onPress={clearBag}>
            <Text style={[typography.caption, { color: colors.danger, fontWeight: '600' }]}>
              Clear Bag
            </Text>
          </Pressable>
        ) : null}
      </View>

      {bag.length === 0 ? (
        <BelliStateView
          mode="empty"
          title={orderPlaced ? 'Drop secured ✦' : 'Your Wavie bag is empty'}
          message={
            orderPlaced
              ? 'Your hoodies are being packed at the Wavie studio.'
              : 'Explore the hoodie drops and select your size to add pieces to your bag.'
          }
        />
      ) : (
        <>
          <ScrollView contentContainerStyle={{ padding: spacing.md, gap: spacing.md }}>
            {bag.map((entry) => (
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
                    ${(Number(entry.product.price) * entry.quantity).toFixed(2)}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                  <Pressable
                    onPress={() => updateBagQuantity(entry.product.id, entry.size, -1)}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: radius.pill,
                      backgroundColor: colors.surfaceMuted,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text style={{ color: colors.text, fontWeight: '700' }}>−</Text>
                  </Pressable>
                  <Text style={[typography.cardTitle, { color: colors.text }]}>
                    {entry.quantity}
                  </Text>
                  <Pressable
                    onPress={() => updateBagQuantity(entry.product.id, entry.size, 1)}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: radius.pill,
                      backgroundColor: colors.accentTint,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text style={{ color: colors.accent, fontWeight: '700' }}>+</Text>
                  </Pressable>
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
                ${bagSubtotal.toFixed(2)}
              </Text>
            </View>
            <BelliButton title="Complete Boutique Order" onPress={handleCheckout} />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
