import type { ColorSystemOptions } from '@mui/material';

declare module '@mui/material/styles' {
  interface TypeBackground {
    neutral: string;
    neutralChannel: string;
  }
}

export const colorSchemes: Record<'light' | 'dark', ColorSystemOptions> = {
  light: {
    palette: {
      background: {
        neutral: '#F7F7F8',
        neutralChannel: '247 247 248',
      },
    },
  },

  dark: {
    palette: {
      background: {
        neutral: '#1A1A1B',
        neutralChannel: '26 26 27',
      },
    },
  },
} as const;
