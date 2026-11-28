import { useColorScheme } from 'react-native';

export const belliPalette = {
  light: {
    background: '#F7F5FA',
    surface: '#FFFFFF',
    surfaceElevated: '#EFEBF7',
    surfaceMuted: '#E5DFF2',
    text: '#14121D',
    textSecondary: '#5B5670',
    textMuted: '#8B85A1',
    accent: '#7A5AF8',
    accentSoft: '#A690FF',
    accentPressed: '#6342E8',
    accentTint: '#EDE8FF',
    onAccent: '#FFFFFF',
    gold: '#F5A623',
    border: '#E1DAF0',
    borderStrong: '#C5B8E6',
    success: '#2E9E76',
    successTint: '#E6F7F0',
    warning: '#D98C1F',
    warningTint: '#FDF4E5',
    danger: '#E0485C',
    dangerTint: '#FDECEF',
    shadow: '#5A45B5',
  },
  dark: {
    background: '#0B0A10',
    surface: '#151320',
    surfaceElevated: '#1E1B2E',
    surfaceMuted: '#28243C',
    text: '#FAF7F2',
    textSecondary: '#B3ACC9',
    textMuted: '#787192',
    accent: '#8B72FF',
    accentSoft: '#A894FF',
    accentPressed: '#7356F5',
    accentTint: '#251F42',
    onAccent: '#FAF7F2',
    gold: '#F7B93E',
    border: '#2A263D',
    borderStrong: '#433B63',
    success: '#4ADEA8',
    successTint: '#142E24',
    warning: '#F7B93E',
    warningTint: '#2F2513',
    danger: '#FF6B7F',
    dangerTint: '#331920',
    shadow: '#000000',
  },
} as const;

export type BelliColors = (typeof belliPalette)['light'] | (typeof belliPalette)['dark'];

export function useBelliColors(): BelliColors {
  const scheme = useColorScheme();
  // Default to Wavie's signature dark obsidian theme when scheme is dark or unspecified
  return belliPalette[scheme === 'light' ? 'light' : 'dark'];
}
