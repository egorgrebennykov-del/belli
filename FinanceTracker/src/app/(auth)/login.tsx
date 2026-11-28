import React, { useState } from 'react';
import { KeyboardAvoidingView, Pressable, ScrollView, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BelliButton, BelliInput } from '@/components/belli-ui';
import { useAuth } from '@/context/auth-context';
import { radius, spacing, typography, useBelliColors } from '@/theme';
import { validateLoginForm } from '@/utils/validation';

export default function LoginScreen() {
  const colors = useBelliColors();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    setServerError(null);
    const result = validateLoginForm({ email, password });
    setFieldErrors(result.errors);
    if (!result.isValid) return;

    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Unable to sign in. Please check your credentials.'
      );
    } finally {
      setSubmitting(false);
    }
  };

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
              Sign in with your Nhost account to browse and manage Belli pieces.
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

            {serverError ? (
              <View
                style={{
                  backgroundColor: colors.dangerTint,
                  borderRadius: radius.md,
                  padding: spacing.sm + 4,
                  borderWidth: 1,
                  borderColor: colors.danger,
                }}>
                <Text style={[typography.caption, { color: colors.danger }]}>{serverError}</Text>
              </View>
            ) : null}

            <BelliInput
              label="Email Address"
              placeholder="name@belli.style"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }));
              }}
              error={fieldErrors.email}
            />

            <BelliInput
              label="Password (min 9 chars)"
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined }));
              }}
              error={fieldErrors.password}
            />

            <BelliButton title="Sign In to Belli" onPress={handleLogin} loading={submitting} />

            <Link href="/(tabs)" asChild>
              <BelliButton title="← Browse Boutique as Guest" variant="ghost" onPress={() => {}} />
            </Link>
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
