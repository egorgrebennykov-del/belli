import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from '@/context/auth-context';
import { BagProvider } from '@/context/bag-context';
import { belliPalette } from '@/theme';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      retry: 1,
    },
  },
});

function RootNavigator() {
  const { isHydrated, isAuthenticated } = useAuth();
  const scheme = useColorScheme();
  const colors = belliPalette[scheme === 'dark' ? 'dark' : 'light'];

  useEffect(() => {
    if (isHydrated) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [isHydrated]);

  if (!isHydrated) {
    return null;
  }

  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="product/[id]"
          options={{ title: 'Piece Details', headerBackTitle: 'Boutique' }}
        />
        <Stack.Screen
          name="collection/[slug]"
          options={{ title: 'Collection' }}
        />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />

        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen
            name="product/manage"
            options={{ title: 'New Piece', presentation: 'modal' }}
          />
          <Stack.Screen
            name="product/edit/[id]"
            options={{ title: 'Edit Piece', presentation: 'modal' }}
          />
        </Stack.Protected>
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BagProvider>
            <RootNavigator />
          </BagProvider>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
