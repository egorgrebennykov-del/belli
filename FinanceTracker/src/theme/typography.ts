import { Platform, TextStyle } from 'react-native';

const serifFamily = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'Georgia, serif',
});

export const typography = {
  brandTitle: {
    fontFamily: serifFamily,
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 0.6,
  } satisfies TextStyle,
  screenTitle: {
    fontFamily: serifFamily,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0.2,
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
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  } satisfies TextStyle,
  price: {
    fontSize: 16,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  } satisfies TextStyle,
} as const;
