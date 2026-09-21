import { Box, styled, type CSSObject } from '@mui/material';
import type { ColorToken } from '../../mui/types';
import { varAlpha } from '../helpers';

const styles: Record<string, CSSObject> = {
  small: { fontSize: '0.75rem', paddingBlock: 4, paddingInline: 8 },
  medium: { fontSize: '0.875rem', paddingBlock: 6, paddingInline: 12 },
  large: { fontSize: '1rem', paddingBlock: 8, paddingInline: 16 },
};

const props = ['color', 'size', 'chip'];

export const Label = styled(Box, {
  shouldForwardProp: (prop) => !props.includes(prop as string),
})<{
  color?: ColorToken | 'default';
  size?: 'small' | 'medium' | 'large';
  chip?: boolean;
}>(({ theme, color = 'default', size = 'medium', chip = false }) => ({
  ...styles[size],
  borderRadius: chip ? 50 : theme.shape.borderRadius,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '4px',
  color:
    color === 'default'
      ? theme.vars!.palette.text.secondary
      : theme.vars!.palette[color].main,
  backgroundColor: varAlpha(
    color === 'default'
      ? theme.vars!.palette.text.secondaryChannel
      : theme.vars!.palette[color].mainChannel,
    color === 'default' ? 0.08 : 0.12,
  ),
  fontWeight: 'bold',
}));
