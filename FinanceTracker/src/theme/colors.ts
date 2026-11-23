import { useColorScheme } from 'react-native';

export const belliPalette = {
  light: {
    background: '#FFF9FB',
    surface: '#FFFFFF',
    surfaceElevated: '#FDF1F5',
    surfaceMuted: '#F9E6ED',
    text: '#26181E',
    textSecondary: '#7A5C68',
    textMuted: '#AD8E9A',
    accent: '#D85A7F',
    accentSoft: '#F29CB4',
    accentPressed: '#B84366',
    accentTint: '#FCE8EF',
    onAccent: '#FFFFFF',
    border: '#F2D8E0',
    borderStrong: '#E4B8C6',
    success: '#2E8B6E',
    successTint: '#E8F6F1',
    warning: '#C9822B',
    warningTint: '#FDF4E7',
    danger: '#C93B54',
    dangerTint: '#FCEBEF',
    shadow: '#C24D6B',
  },
  dark: {
    background: '#160F13',
    surface: '#22171D',
    surfaceElevated: '#2C1E26',
    surfaceMuted: '#382530',
    text: '#FAF0F4',
    textSecondary: '#C8AEB8',
    textMuted: '#8F717D',
    accent: '#F4A6B8',
    accentSoft: '#E27D98',
    accentPressed: '#D45B7A',
    accentTint: '#3D222D',
    onAccent: '#241218',
    border: '#3D2833',
    borderStrong: '#5A3A4A',
    success: '#58C4A0',
    successTint: '#19332A',
    warning: '#E9AA58',
    warningTint: '#362817',
    danger: '#F06A80',
    dangerTint: '#3D1D25',
    shadow: '#000000',
  },
} as const;

export type BelliColors = (typeof belliPalette)['light'] | (typeof belliPalette)['dark'];

export function useBelliColors(): BelliColors {
  const scheme = useColorScheme();
  return belliPalette[scheme === 'dark' ? 'dark' : 'light'];
}
