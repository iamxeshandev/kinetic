import type { TypographyVariantsOptions } from '@mui/material';

export const typography: TypographyVariantsOptions = {
  fontFamily: [
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
  ].join(','),

  fontSize: 16,

  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,

  h1: {
    fontSize: '2.5rem', // 40px
    lineHeight: 1.2,
    fontWeight: 700,
    letterSpacing: '-0.02em',
  },

  h2: {
    fontSize: '2rem', // 32px
    lineHeight: 1.25,
    fontWeight: 700,
    letterSpacing: '-0.02em',
  },

  h3: {
    fontSize: '1.5rem', // 24px
    lineHeight: 1.3,
    fontWeight: 600,
    letterSpacing: '-0.01em',
  },

  h4: {
    fontSize: '1.25rem', // 20px
    lineHeight: 1.4,
    fontWeight: 600,
  },

  h5: {
    fontSize: '1.125rem', // 18px
    lineHeight: 1.45,
    fontWeight: 600,
  },

  h6: {
    fontSize: '1rem', // 16px
    lineHeight: 1.5,
    fontWeight: 600,
  },

  subtitle1: {
    fontSize: '1rem', // 16px
    lineHeight: 1.5,
    fontWeight: 500,
  },

  subtitle2: {
    fontSize: '0.875rem', // 14px
    lineHeight: 1.45,
    fontWeight: 500,
  },

  body1: {
    fontSize: '1rem', // 16px
    lineHeight: 1.5,
    fontWeight: 400,
  },

  body2: {
    fontSize: '0.875rem', // 14px
    lineHeight: 1.45,
    fontWeight: 400,
  },

  button: {
    fontSize: '0.875rem', // 14px
    lineHeight: 1.4,
    fontWeight: 500,
    textTransform: 'none',
  },

  caption: {
    fontSize: '0.75rem', // 12px
    lineHeight: 1.4,
    fontWeight: 400,
  },

  overline: {
    fontSize: '0.6875rem', // 11px
    lineHeight: 1.4,
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
};
