import { Stack } from 'expo-router';
import { useBelliColors } from '@/theme';

export default function AuthLayout() {
  const colors = useBelliColors();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
