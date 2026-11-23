import React from 'react';
import { Text } from 'react-native';
import { Tabs } from 'expo-router';

import { HARDCODED_BAG } from '@/data/mock-clothes';
import { useBelliColors } from '@/theme';

export default function TabsLayout() {
  const colors = useBelliColors();

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
          title: 'Boutique',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>✦</Text>,
        }}
      />
      <Tabs.Screen
        name="bag"
        options={{
          title: 'Bag',
          tabBarBadge: HARDCODED_BAG.length,
          tabBarBadgeStyle: { backgroundColor: colors.accent, color: colors.onAccent },
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🛍</Text>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Atelier',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>♡</Text>,
        }}
      />
    </Tabs>
  );
}
