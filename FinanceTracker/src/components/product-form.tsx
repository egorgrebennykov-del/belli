import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

import { BelliButton, BelliInput } from '@/components/belli-ui';
import { useAuth } from '@/context/auth-context';
import {
  BELLI_CATEGORIES,
  BoutiqueProduct,
  createNhostProduct,
  updateNhostProduct,
} from '@/services/nhost';
import { radius, spacing, typography, useBelliColors } from '@/theme';
import { validateProductForm } from '@/utils/validation';

type EditableCategory = Exclude<(typeof BELLI_CATEGORIES)[number], 'All'>;

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80';

export function ProductForm({
  mode,
  initialProduct,
}: {
  mode: 'create' | 'edit';
  initialProduct?: BoutiqueProduct;
}) {
  const colors = useBelliColors();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();

  const [title, setTitle] = useState(initialProduct?.title ?? '');
  const [brand, setBrand] = useState(initialProduct?.brand ?? 'Belli Atelier');
  const [price, setPrice] = useState(
    initialProduct?.price !== undefined ? String(initialProduct.price) : '145'
  );
  const [stock, setStock] = useState(
    initialProduct?.stock !== undefined ? String(initialProduct.stock) : '10'
  );
  const [description, setDescription] = useState(initialProduct?.description ?? '');
  const [category, setCategory] = useState<EditableCategory>(
    initialProduct?.category ?? 'Dresses'
  );
  const [featured, setFeatured] = useState(initialProduct?.featured ?? true);
  const [imageUri, setImageUri] = useState(initialProduct?.image ?? DEFAULT_IMAGE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!accessToken) {
        throw new Error('You must be signed in to save changes.');
      }

      const payload = {
        title: title.trim(),
        brand: brand.trim(),
        price: Number(price),
        stock: Number(stock),
        description: description.trim(),
        category,
        image: imageUri,
        featured,
      };

      if (mode === 'create') {
        return createNhostProduct(accessToken, payload);
      }
      return updateNhostProduct(accessToken, initialProduct!.id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nhost-products'] });
      if (initialProduct) {
        queryClient.invalidateQueries({ queryKey: ['nhost-product', initialProduct.id] });
      }
      router.back();
    },
    onError: (err) => {
      setServerError(err instanceof Error ? err.message : 'Unable to save piece to Nhost.');
    },
  });

  const handlePickPhoto = async (useCamera: boolean) => {
    const permission = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Permission Required',
        `Please allow ${useCamera ? 'camera' : 'photo library'} access to attach a garment photo.`
      );
      return;
    }

    const result = useCamera
      ? await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 5], quality: 0.75 })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [4, 5],
          quality: 0.75,
        });

    if (!result.canceled && result.assets[0]?.uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (mutation.isPending) return;
    setServerError(null);
    const result = validateProductForm({ title, brand, price, stock, description });
    setErrors(result.errors);
    if (!result.isValid) return;
    mutation.mutate();
  };

  const editableCategories = BELLI_CATEGORIES.filter(
    (c): c is EditableCategory => c !== 'All'
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={process.env.EXPO_OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl }}
        keyboardShouldPersistTaps="handled">
        {serverError ? (
          <View
            style={{
              backgroundColor: colors.dangerTint,
              borderRadius: radius.md,
              padding: spacing.md,
              borderWidth: 1,
              borderColor: colors.danger,
            }}>
            <Text style={[typography.caption, { color: colors.danger }]}>{serverError}</Text>
          </View>
        ) : null}

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
            source={{ uri: imageUri }}
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
              Capture with camera or select from library
            </Text>
            <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: 4 }}>
              <Pressable
                onPress={() => handlePickPhoto(true)}
                style={{
                  paddingHorizontal: spacing.sm + 4,
                  paddingVertical: spacing.xs + 2,
                  borderRadius: radius.pill,
                  backgroundColor: colors.accentTint,
                }}>
                <Text style={[typography.caption, { color: colors.accent, fontWeight: '700' }]}>
                  Camera
                </Text>
              </Pressable>
              <Pressable
                onPress={() => handlePickPhoto(false)}
                style={{
                  paddingHorizontal: spacing.sm + 4,
                  paddingVertical: spacing.xs + 2,
                  borderRadius: radius.pill,
                  backgroundColor: colors.surfaceMuted,
                }}>
                <Text style={[typography.caption, { color: colors.text, fontWeight: '600' }]}>
                  Gallery
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        <BelliInput
          label="Piece Title"
          placeholder="e.g. Rose Silk Slip Dress"
          value={title}
          onChangeText={setTitle}
          error={errors.title}
        />

        <BelliInput
          label="Atelier / Brand"
          placeholder="e.g. Belli Atelier"
          value={brand}
          onChangeText={setBrand}
          error={errors.brand}
        />

        <View style={{ gap: spacing.xs }}>
          <Text style={[typography.caption, { color: colors.textSecondary, fontWeight: '600' }]}>
            Category
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: spacing.xs }}>
            {editableCategories.map((cat) => {
              const selected = category === cat;
              return (
                <Pressable
                  key={cat}
                  onPress={() => setCategory(cat)}
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
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <View style={{ flex: 1 }}>
            <BelliInput
              label="Price (USD)"
              placeholder="145"
              keyboardType="decimal-pad"
              value={price}
              onChangeText={setPrice}
              error={errors.price}
            />
          </View>
          <View style={{ flex: 1 }}>
            <BelliInput
              label="Stock Units"
              placeholder="10"
              keyboardType="number-pad"
              value={stock}
              onChangeText={setStock}
              error={errors.stock}
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
              ${Number(price) || 0}
            </Text>
          </View>
          <Slider
            minimumValue={15}
            maximumValue={500}
            step={5}
            value={Math.min(500, Math.max(15, Number(price) || 145))}
            onValueChange={(val) => setPrice(String(Math.round(val)))}
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
          style={{ minHeight: 96, textAlignVertical: 'top' }}
          value={description}
          onChangeText={setDescription}
          error={errors.description}
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
            value={featured}
            onValueChange={setFeatured}
            trackColor={{ false: colors.border, true: colors.accentSoft }}
            thumbColor={featured ? colors.accent : colors.surface}
          />
        </View>

        <BelliButton
          title={mode === 'create' ? 'Publish to Nhost' : 'Save Changes'}
          onPress={handleSubmit}
          loading={mutation.isPending}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
