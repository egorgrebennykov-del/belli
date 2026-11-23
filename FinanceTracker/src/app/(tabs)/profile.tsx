import React from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BelliButton } from '@/components/belli-ui';
import { HARDCODED_USER } from '@/data/mock-clothes';
import { radius, spacing, typography, useBelliColors } from '@/theme';

export default function ProfileScreen() {
  const colors = useBelliColors();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
        <View style={{ alignItems: 'center', gap: spacing.sm }}>
          <View
            style={{
              width: 108,
              height: 108,
              borderRadius: radius.pill,
              borderWidth: 2,
              borderColor: colors.accent,
              backgroundColor: colors.accentTint,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={[typography.brandTitle, { color: colors.accent }]}>S</Text>
          </View>

          <Text style={[typography.micro, { color: colors.accent }]}>
            ✦ {HARDCODED_USER.membership}
          </Text>
          <Text style={[typography.screenTitle, { color: colors.text }]}>
            {HARDCODED_USER.name}
          </Text>
          <Text selectable style={[typography.body, { color: colors.textSecondary }]}>
            {HARDCODED_USER.email}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          <View
            style={{
              flex: 1,
              backgroundColor: colors.surface,
              borderRadius: radius.lg,
              borderWidth: 1,
              borderColor: colors.border,
              padding: spacing.md,
              alignItems: 'center',
              gap: 4,
            }}>
            <Text style={[typography.screenTitle, { color: colors.accent }]}>
              {HARDCODED_USER.savedCount}
            </Text>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>Saved Looks</Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: colors.surface,
              borderRadius: radius.lg,
              borderWidth: 1,
              borderColor: colors.border,
              padding: spacing.md,
              alignItems: 'center',
              gap: 4,
            }}>
            <Text style={[typography.screenTitle, { color: colors.accent }]}>
              {HARDCODED_USER.ordersCount}
            </Text>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>Orders</Text>
          </View>
        </View>

        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: radius.lg,
            borderWidth: 1,
            borderColor: colors.border,
            padding: spacing.md,
            gap: spacing.md,
          }}>
          <Text style={[typography.sectionTitle, { color: colors.text }]}>Boutique Studio</Text>

          <Link href="/product/manage" asChild>
            <Pressable
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: spacing.xs,
              }}>
              <View>
                <Text style={[typography.cardTitle, { color: colors.text }]}>
                  Publish New Piece
                </Text>
                <Text style={[typography.caption, { color: colors.textSecondary }]}>
                  Preview garment creation layout
                </Text>
              </View>
              <Text style={{ color: colors.accent, fontSize: 18 }}>→</Text>
            </Pressable>
          </Link>

          <View style={{ height: 1, backgroundColor: colors.border }} />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{ flex: 1, paddingRight: spacing.md }}>
              <Text style={[typography.cardTitle, { color: colors.text }]}>
                Biometric Lock (Face ID / Touch)
              </Text>
              <Text style={[typography.caption, { color: colors.textSecondary }]}>
                Static preview toggle
              </Text>
            </View>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: colors.border, true: colors.accentSoft }}
              thumbColor={colors.accent}
            />
          </View>
        </View>

        <Link href="/(auth)/login" asChild>
          <BelliButton title="Sign Out (Go to Login)" variant="danger" onPress={() => {}} />
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
}
