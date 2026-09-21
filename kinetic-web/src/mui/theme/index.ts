import { createTheme, Paper } from '@mui/material';
import { colorSchemes } from './color-schemes';
import { typography } from './typography';

declare module '@mui/material/Avatar' {
  interface AvatarOwnProps {
    size?: 'small' | 'medium' | 'large';
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    secondary: true;
  }
}

export const theme = createTheme({
  cssVariables: { colorSchemeSelector: 'class' },
  colorSchemes,
  typography,
  components: {
    MuiAvatar: {
      defaultProps: {
        size: 'medium',
      },
      variants: [
        {
          props: { size: 'small' },
          style: { width: 24, height: 24, fontSize: '0.875rem' },
        },
        {
          props: { size: 'medium' },
          style: { width: 32, height: 32, fontSize: '1rem' },
        },
        {
          props: { size: 'large' },
          style: { width: 40, height: 40, fontSize: '1.25rem' },
        },
      ],
    },
    MuiButton: {
      variants: [
        {
          props: { variant: 'secondary' },
          style: {
            color: 'var(--mui-palette-text-secondary)',
            border: '1px solid',
            borderColor: 'var(--mui-palette-divider)',
          },
        },
      ],
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
    MuiDialog: {
      defaultProps: {
        closeAfterTransition: false,
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '0 24px 16px',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        spacing: {
          padding: '16px 24px',
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
    MuiTableContainer: {
      defaultProps: {
        component: Paper,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
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
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 'bold',
        },
      },
    },
    MuiToggleButton: {
      variants: [
        { props: { size: 'small' }, style: { fontSize: '1rem' } },
        { props: { size: 'medium' }, style: { fontSize: '1.25rem' } },
        { props: { size: 'large' }, style: { fontSize: '1.5rem' } },
      ],
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
