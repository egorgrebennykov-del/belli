import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BelliButton } from '@/components/belli-ui';
import { useAuth } from '@/context/auth-context';
import { useBag } from '@/context/bag-context';
import { radius, spacing, typography, useBelliColors } from '@/theme';

export default function ProfileScreen() {
  const colors = useBelliColors();
  const {
    user,
    isAuthenticated,
    logout,
    updateAvatar,
    biometricsEnabled,
    biometricsAvailable,
    toggleBiometrics,
  } = useAuth();
  const { favoriteIds, bagCount } = useBag();
  const [updatingPhoto, setUpdatingPhoto] = useState(false);

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            padding: spacing.lg,
            gap: spacing.lg,
          }}>
          <View style={{ alignItems: 'center', gap: spacing.sm }}>
            <View
              style={{
                width: 96,
                height: 96,
                borderRadius: radius.pill,
                backgroundColor: colors.accentTint,
                borderWidth: 2,
                borderColor: colors.accent,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={[typography.brandTitle, { color: colors.accent }]}>W</Text>
            </View>
            <Text style={[typography.screenTitle, { color: colors.text }]}>
              Wavie Club
            </Text>
            <Text
              style={[
                typography.body,
                { color: colors.textSecondary, textAlign: 'center', maxWidth: 290 },
              ]}>
              Sign in to publish new hoodies, edit drop items, and sync your profile.
            </Text>
          </View>

          <View style={{ gap: spacing.sm }}>
            <Link href="/(auth)/login" asChild>
              <BelliButton title="Sign In" onPress={() => {}} />
            </Link>
            <Link href="/(auth)/register" asChild>
              <BelliButton title="Create Account" variant="secondary" onPress={() => {}} />
            </Link>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const pickProfileImage = async (useCamera: boolean) => {
    setUpdatingPhoto(true);
    try {
      const permission = useCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Permission Required',
          `Please allow ${useCamera ? 'camera' : 'photo library'} access to update your Belli avatar.`
        );
        return;
      }

      const result = useCamera
        ? await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.75,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.75,
          });

      if (!result.canceled && result.assets[0]?.uri) {
        await updateAvatar(result.assets[0].uri);
      }
    } finally {
      setUpdatingPhoto(false);
    }
  };

  const handleAvatarPress = () => {
    Alert.alert('Update Atelier Avatar', 'Choose a photo source', [
      { text: 'Take Photo', onPress: () => pickProfileImage(true) },
      { text: 'Choose from Library', onPress: () => pickProfileImage(false) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleBiometricToggle = async (next: boolean) => {
    const ok = await toggleBiometrics(next);
    if (!ok && next) {
      Alert.alert(
        'Biometrics Unavailable',
        'Could not verify Face ID / Fingerprint on this device.'
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
        <View style={{ alignItems: 'center', gap: spacing.sm }}>
          <Pressable
            onPress={handleAvatarPress}
            disabled={updatingPhoto}
            style={{
              width: 108,
              height: 108,
              borderRadius: radius.pill,
              borderWidth: 2,
              borderColor: colors.accent,
              backgroundColor: colors.accentTint,
              overflow: 'hidden',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {user?.avatarUrl ? (
              <Image
                source={{ uri: user.avatarUrl }}
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
              />
            ) : (
              <Text style={[typography.brandTitle, { color: colors.accent }]}>
                {(user?.displayName?.[0] ?? 'B').toUpperCase()}
              </Text>
            )}
          </Pressable>

          <Pressable onPress={handleAvatarPress}>
            <Text style={[typography.caption, { color: colors.accent, fontWeight: '700' }]}>
              {updatingPhoto ? 'Updating...' : '✦ Change Profile Photo'}
            </Text>
          </Pressable>

          <Text style={[typography.screenTitle, { color: colors.text }]}>
            {user?.displayName || 'Belli Member'}
          </Text>
          <Text selectable style={[typography.body, { color: colors.textSecondary }]}>
            {user?.email}
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
              {favoriteIds.length}
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
            <Text style={[typography.screenTitle, { color: colors.accent }]}>{bagCount}</Text>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>In Bag</Text>
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
                  Insert a new garment directly into Nhost Postgres
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
                {biometricsAvailable
                  ? 'Require device biometrics before deleting pieces'
                  : 'Hardware biometrics not enrolled on this device'}
              </Text>
            </View>
            <Switch
              value={biometricsEnabled}
              onValueChange={handleBiometricToggle}
              trackColor={{ false: colors.border, true: colors.accentSoft }}
              thumbColor={biometricsEnabled ? colors.accent : colors.surface}
            />
          </View>
        </View>

        <BelliButton title="Sign Out" variant="danger" onPress={logout} />
      </ScrollView>
    </SafeAreaView>
  );
}
