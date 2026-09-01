import { Box, styled, type CSSObject } from '@mui/material';
import type { ColorToken } from '../../theme';
import { varAlpha } from '../../utils/helpers';

const styles: Record<string, CSSObject> = {
  small: { fontSize: '0.75rem', paddingBlock: 4, paddingInline: 8 },
  medium: { fontSize: '0.875rem', paddingBlock: 6, paddingInline: 12 },
  large: { fontSize: '1rem', paddingBlock: 8, paddingInline: 16 },
};

const props = ['color', 'size', 'chip'];

export const Label = styled(Box, {
  shouldForwardProp: (prop) => !props.includes(prop as string),
})<{ color?: ColorToken; size?: 'small' | 'medium' | 'large'; chip?: boolean }>(
  ({ theme, color = 'primary', size = 'medium', chip = false }) => ({
    ...styles[size],
    borderRadius: chip ? 50 : theme.shape.borderRadius,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.vars!.palette[color].main,
    backgroundColor: varAlpha(
      theme.vars!.palette[color].mainChannel,
      theme.vars!.palette.action.selectedOpacity,
    ),
    fontWeight: 'bold',
  }),
);
