/** Design tokens. Every colour, space and font size in the app comes from here. */
export const colors = {
  accent: '#1B2A4A', // navy
  accentContrast: '#FFFFFF',
  background: '#F5F7FB',
  surface: '#FFFFFF',
  border: '#DCE2EC',
  text: '#121826',
  textMuted: '#5B6578',
  success: '#1E7F4F',
  danger: '#B42318',
  pending: '#8A94A6',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radii = {
  sm: 6,
  md: 10,
  lg: 16,
  pill: 999,
} as const;

export const typeScale = {
  caption: { fontSize: 13, lineHeight: 18 },
  body: { fontSize: 16, lineHeight: 22 },
  title: { fontSize: 20, lineHeight: 26, fontWeight: '600' },
  display: { fontSize: 34, lineHeight: 40, fontWeight: '700' },
} as const;
