import { createTheme, Paper } from '@mui/material';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    overline1: React.CSSProperties;
    overline2: React.CSSProperties;
  }
  interface TypographyVariantsOptions {
    overline1?: React.CSSProperties;
    overline2?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    overline: false;
    overline1: true;
    overline2: true;
  }
}

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
    overline: undefined,
    overline1: {
      fontWeight: 'bold',
      textTransform: 'uppercase',
      color: 'var(--mui-palette-text-secondary)',
    },
    overline2: {
      fontWeight: 'bold',
      textTransform: 'uppercase',
      color: 'var(--mui-palette-text-secondary)',
      fontSize: '0.875rem',
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
          flexShrink: 0,
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
    MuiChip: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.icon && { paddingLeft: '4px' }),
        }),
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
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
    },
    MuiTableContainer: {
      defaultProps: {
        component: Paper,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          // boxShadow: 'none',
          border: '1px solid',
          borderColor: 'var(--mui-palette-divider)',
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          '& :last-child td': {
            borderBottom: 'none',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: 'var(--mui-palette-action-hover)',
          fontWeight: 'bold',
          color: 'var(--mui-palette-text-secondary)',
        },
      },
    },
    MuiTooltip: {
      defaultProps: {
        arrow: true,
        placement: 'top',
        enterDelay: 1000,
      },
    },
  },
});
