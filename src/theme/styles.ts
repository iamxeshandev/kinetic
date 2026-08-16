import { type CSSObject, type Theme } from '@mui/material';

export const styles = (theme: Theme): Record<string, CSSObject> => ({
  '*': {
    scrollbarWidth: 'thin',
  },
  '#root': {
    minHeight: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
  },
  header: {
    position: 'sticky',
    top: 0,
    zIndex: theme.zIndex.appBar,
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  '.glass': {
    backgroundColor: 'rgb(var(--mui-palette-background-defaultChannel) / 0.82)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    backgroundClip: 'padding-box',
    WebkitBackgroundClip: 'padding-box',
  },
  '@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))':
    {
      '.glass': {
        backgroundColor:
          'rgb(var(--mui-palette-background-defaultChannel) / 0.94)',
      },
    },
});
