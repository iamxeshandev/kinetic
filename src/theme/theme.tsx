import { createTheme } from '@mui/material';

export const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'class',
  },
  colorSchemes: {
    light: true,
    dark: true,
  },
  typography: {
    h1: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 'bold',
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 'bold',
    },
    h4: {
      fontSize: '1.75rem',
      fontWeight: 'bold',
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
    },
    subtitle1: {
      color: 'var(--mui-palette-text-secondary)',
    },
    subtitle2: {
      color: 'var(--mui-palette-text-secondary)',
    },
    caption: {
      fontWeight: 'bold',
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: 'contained',
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          textWrap: 'nowrap',
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 4,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiLink: {
      defaultProps: {
        underline: 'hover',
      },
      styleOverrides: {
        root: {
          fontWeight: 'bold',
          fontSize: '0.9rem',
          cursor: 'pointer',
        },
      },
    },
  },
});
