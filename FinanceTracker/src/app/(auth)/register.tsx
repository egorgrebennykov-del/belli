import React from 'react';
import { KeyboardAvoidingView, Pressable, ScrollView, Text, View } from 'react-native';
import { Link, useRouter, type Href } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BelliButton, BelliInput } from '@/components/belli-ui';
import { radius, spacing, typography, useBelliColors } from '@/theme';

export default function RegisterScreen() {
  const colors = useBelliColors();
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={process.env.EXPO_OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            padding: spacing.lg,
            gap: spacing.lg,
          }}
          keyboardShouldPersistTaps="handled">
          <View style={{ gap: spacing.xs }}>
            <Text style={[typography.micro, { color: colors.accent }]}>✦ BELLI MEMBERSHIP</Text>
            <Text style={[typography.brandTitle, { color: colors.text }]}>Join the Atelier</Text>
            <Text style={[typography.body, { color: colors.textSecondary }]}>
              Create your personal Belli profile to save looks and curate pieces.
            </Text>
          </View>

          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: radius.xl,
              borderCurve: 'continuous',
              borderWidth: 1,
              borderColor: colors.border,
              padding: spacing.lg,
              gap: spacing.md,
            }}>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <View style={{ flex: 1 }}>
                <BelliInput label="First Name" placeholder="Sofia" />
              </View>
              <View style={{ flex: 1 }}>
                <BelliInput label="Last Name" placeholder="Bellini" />
              </View>
            </View>

            <BelliInput
              label="Email Address"
              placeholder="sofia@belli.style"
              keyboardType="email-address"
            />
            <BelliInput label="Password" placeholder="Belli2026" secureTextEntry />

            <BelliButton
              title="Create Belli Account"
              onPress={() => router.replace('/' as Href)}
            />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: spacing.xs }}>
            <Text style={[typography.body, { color: colors.textSecondary }]}>
              Already a member?
            </Text>
            <Link href="/(auth)/login" asChild>
              <Pressable>
                <Text style={[typography.body, { color: colors.accent, fontWeight: '700' }]}>
                  Sign In
                </Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
