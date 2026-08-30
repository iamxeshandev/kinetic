import { Box, styled } from '@mui/material';
import type { ColorToken } from '../../theme';
import { varAlpha } from '../../utils/helpers';

const props = ['color', 'size'];

export const Label = styled(Box, {
  shouldForwardProp: (prop) => !props.includes(prop as string),
})<{ color?: ColorToken; size?: 'small' | 'medium' | 'large' }>(
  ({ theme, color = 'primary' }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.vars!.palette[color].main,
    backgroundColor: varAlpha(
      theme.vars!.palette[color].mainChannel,
      theme.vars!.palette.action.selectedOpacity,
    ),
    borderRadius: 8,
    fontWeight: 'bold',
    padding: 8,
  }),
);
