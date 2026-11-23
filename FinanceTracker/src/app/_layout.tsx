import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { belliPalette } from '@/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const scheme = useColorScheme();
  const colors = belliPalette[scheme === 'dark' ? 'dark' : 'light'];

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen
          name="product/[id]"
          options={{ title: 'Piece Details', headerBackTitle: 'Boutique' }}
        />
        <Stack.Screen
          name="product/manage"
          options={{ title: 'New Piece', presentation: 'modal' }}
        />
        <Stack.Screen
          name="product/edit/[id]"
          options={{ title: 'Edit Piece', presentation: 'modal' }}
        />
        <Stack.Screen
          name="collection/[slug]"
          options={{ title: 'Collection' }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
