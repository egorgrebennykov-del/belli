import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';

import { radius, spacing, typography, useBelliColors } from '@/theme';

export function BelliButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}: {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}) {
  const colors = useBelliColors();
  const isDisabled = disabled || loading;

  const backgroundColor =
    variant === 'primary'
      ? colors.accent
      : variant === 'secondary'
        ? colors.accentTint
        : variant === 'danger'
          ? colors.dangerTint
          : 'transparent';

  const textColor =
    variant === 'primary'
      ? colors.onAccent
      : variant === 'danger'
        ? colors.danger
        : colors.accent;

  const borderColor =
    variant === 'secondary'
      ? colors.borderStrong
      : variant === 'danger'
        ? colors.danger
        : 'transparent';

  return (
    <Pressable
      onPress={() => {
        if (process.env.EXPO_OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        }
        onPress();
      }}
      disabled={isDisabled}
      style={({ pressed }) => [
        {
          minHeight: 50,
          borderRadius: radius.pill,
          borderCurve: 'continuous',
          backgroundColor:
            pressed && variant === 'primary' ? colors.accentPressed : backgroundColor,
          borderWidth: variant === 'secondary' || variant === 'danger' ? 1 : 0,
          borderColor,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: spacing.lg,
          opacity: isDisabled ? 0.55 : pressed ? 0.88 : 1,
          flexDirection: 'row',
          gap: spacing.sm,
        },
        style,
      ]}>
      {loading && <ActivityIndicator size="small" color={textColor} />}
      <Text style={[typography.cardTitle, { color: textColor, fontWeight: '700' }]}>
        {title}
      </Text>
    </Pressable>
  );
}

export function BelliInput({
  label,
  error,
  ...props
}: TextInputProps & {
  label: string;
  error?: string;
}) {
  const colors = useBelliColors();

  return (
    <View style={{ gap: spacing.xs }}>
      <Text style={[typography.caption, { color: colors.textSecondary, fontWeight: '600' }]}>
        {label}
      </Text>
      <TextInput
        placeholderTextColor={colors.textMuted}
        {...props}
        style={[
          {
            minHeight: 48,
            borderRadius: radius.md,
            borderCurve: 'continuous',
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: error ? colors.danger : colors.border,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm + 2,
            color: colors.text,
            fontSize: 15,
          },
          props.style,
        ]}
      />
      {error ? (
        <Text style={[typography.caption, { color: colors.danger }]}>{error}</Text>
      ) : null}
    </View>
  );
}

export function BelliStateView({
  mode,
  title,
  message,
  actionLabel,
  onAction,
}: {
  mode: 'loading' | 'error' | 'empty';
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const colors = useBelliColors();

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
        gap: spacing.md,
      }}>
      {mode === 'loading' ? (
        <ActivityIndicator size="large" color={colors.accent} />
      ) : (
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: radius.pill,
            backgroundColor: mode === 'error' ? colors.dangerTint : colors.accentTint,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{ fontSize: 22, color: mode === 'error' ? colors.danger : colors.accent }}>
            {mode === 'error' ? '!' : '✦'}
          </Text>
        </View>
      )}
      <Text style={[typography.sectionTitle, { color: colors.text, textAlign: 'center' }]}>
        {title}
      </Text>
      <Text
        style={[
          typography.body,
          { color: colors.textSecondary, textAlign: 'center', maxWidth: 290 },
        ]}>
        {message}
      </Text>
      {actionLabel && onAction ? (
        <BelliButton title={actionLabel} onPress={onAction} variant="secondary" />
      ) : null}
    </View>
  );
}
