import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Pressable, ScrollView, Text, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BelliButton, BelliInput } from '@/components/belli-ui';
import { useAuth } from '@/context/auth-context';
import { radius, spacing, typography, useBelliColors } from '@/theme';
import { validateRegisterForm } from '@/utils/validation';

export default function RegisterScreen() {
  const colors = useBelliColors();
  const router = useRouter();
  const { register } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
  }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async () => {
    setServerError(null);
    const result = validateRegisterForm({ firstName, lastName, email, password });
    setFieldErrors(result.errors);
    if (!result.isValid) return;

    setSubmitting(true);
    try {
      const res = await register({ firstName, lastName, email, password });
      if (res.verificationRequired) {
        Alert.alert(
          'Verify Your Email ✦',
          'Your Belli account was created. Please click the verification link sent to your email, then sign in.',
          [{ text: 'Go to Login', onPress: () => router.replace('/(auth)/login') }]
        );
      }
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Registration failed. Please try again.'
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
          <View style={{ gap: spacing.xs }}>
            <Text style={[typography.micro, { color: colors.accent }]}>✦ BELLI MEMBERSHIP</Text>
            <Text style={[typography.brandTitle, { color: colors.text }]}>Join the Atelier</Text>
            <Text style={[typography.body, { color: colors.textSecondary }]}>
              Create your personal Belli account via Nhost Auth.
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

            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <View style={{ flex: 1 }}>
                <BelliInput
                  label="First Name"
                  placeholder="Sofia"
                  value={firstName}
                  onChangeText={setFirstName}
                  error={fieldErrors.firstName}
                />
              </View>
              <View style={{ flex: 1 }}>
                <BelliInput
                  label="Last Name"
                  placeholder="Bellini"
                  value={lastName}
                  onChangeText={setLastName}
                  error={fieldErrors.lastName}
                />
              </View>
            </View>

            <BelliInput
              label="Email Address"
              placeholder="sofia@belli.style"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              error={fieldErrors.email}
            />

            <BelliInput
              label="Password (min 9 chars, letter + number)"
              placeholder="e.g. Belli2026!"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              error={fieldErrors.password}
            />

            <BelliButton title="Create Belli Account" onPress={handleRegister} loading={submitting} />
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
