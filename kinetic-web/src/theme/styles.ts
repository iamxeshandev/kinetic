import { type CSSObject, type Theme } from '@mui/material';
import { varAlpha } from '../shared/helpers';

export const styles = (theme: Theme): Record<string, CSSObject> => ({
  '*': {
    scrollbarWidth: 'thin',
  },
  '#root': {
    minHeight: '100dvh',
    minWidth: '320px',
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
    backgroundColor: varAlpha(
      theme.vars!.palette.background.defaultChannel,
      0.8,
    ),
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    backgroundClip: 'padding-box',
    WebkitBackgroundClip: 'padding-box',
  },
});
