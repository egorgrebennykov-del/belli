import React from 'react';
import { Text } from 'react-native';
import { Tabs } from 'expo-router';

import { useBag } from '@/context/bag-context';
import { useBelliColors } from '@/theme';

export default function TabsLayout() {
  const colors = useBelliColors();
  const { bagCount } = useBag();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Hoodies',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>✦</Text>,
        }}
      />
      <Tabs.Screen
        name="bag"
        options={{
          title: 'Bag',
          tabBarBadge: bagCount > 0 ? bagCount : undefined,
          tabBarBadgeStyle: { backgroundColor: colors.accent, color: colors.onAccent },
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🛍</Text>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Wavie Club',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>★</Text>,
        }}
      />
    </Tabs>
  );
}
