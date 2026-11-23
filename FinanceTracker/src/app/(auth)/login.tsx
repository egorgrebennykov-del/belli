import React from 'react';
import { KeyboardAvoidingView, Pressable, ScrollView, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Link, useRouter, type Href } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BelliButton, BelliInput } from '@/components/belli-ui';
import { radius, spacing, typography, useBelliColors } from '@/theme';

export default function LoginScreen() {
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
          <View style={{ alignItems: 'center', gap: spacing.sm }}>
            <Image
              source={require('../../../assets/images/belli-logo.png')}
              style={{ width: '92%', maxWidth: 320, height: 185 }}
              contentFit="contain"
            />
            <Text style={[typography.micro, { color: colors.accent }]}>
              ✦ CURATED CLOTHING ATELIER ✦
            </Text>
            <Text style={[typography.body, { color: colors.textSecondary, textAlign: 'center' }]}>
              Sign in to explore the seasonal collection and boutique pieces.
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
              shadowColor: colors.shadow,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.08,
              shadowRadius: 20,
              elevation: 2,
            }}>
            <Text style={[typography.screenTitle, { color: colors.text }]}>Welcome back</Text>

            <BelliInput
              label="Email or Username"
              placeholder="sofia@belli.style"
              defaultValue="sofia@belli.style"
            />
            <BelliInput
              label="Password"
              placeholder="••••••••"
              secureTextEntry
              defaultValue="Belli2026"
            />

            <BelliButton
              title="Sign In to Belli"
              onPress={() => router.replace('/' as Href)}
            />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: spacing.xs }}>
            <Text style={[typography.body, { color: colors.textSecondary }]}>
              New to Belli?
            </Text>
            <Link href="/(auth)/register" asChild>
              <Pressable>
                <Text style={[typography.body, { color: colors.accent, fontWeight: '700' }]}>
                  Create Account
                </Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
