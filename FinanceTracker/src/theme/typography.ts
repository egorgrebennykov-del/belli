import { Platform, TextStyle } from 'react-native';

const displayFamily = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'system-ui, -apple-system, sans-serif',
});

export const typography = {
  brandTitle: {
    fontFamily: displayFamily,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.4,
  } satisfies TextStyle,
  screenTitle: {
    fontFamily: displayFamily,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.3,
  } satisfies TextStyle,
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
  } satisfies TextStyle,
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  } satisfies TextStyle,
  body: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
  } satisfies TextStyle,
  caption: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  } satisfies TextStyle,
  micro: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  } satisfies TextStyle,
  price: {
    fontSize: 16,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  } satisfies TextStyle,
} as const;
