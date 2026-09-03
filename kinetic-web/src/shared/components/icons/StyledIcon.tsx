import { styled } from '@mui/material';
import type { ComponentPropsWithoutRef } from 'react';
import type { IconType } from 'react-icons/lib';
import type { ColorToken } from '../../../theme';

export type StyledIconProps = {
  icon: IconType;
  size?: 'small' | 'medium' | 'large';
  color?: ColorToken | 'inherit';
} & ComponentPropsWithoutRef<'svg'>;

const sizeMap: Record<'small' | 'medium' | 'large', string> = {
  small: '1rem',
  medium: '1.5rem',
  large: '2rem',
};

export const StyledIcon = styled(
  ({ icon: Component, ...props }: StyledIconProps) => <Component {...props} />,
  { shouldForwardProp: (prop) => prop !== 'size' && prop !== 'color' },
)(({ theme, size = 'medium', color = 'inherit' }) => {
  return {
    fontSize: sizeMap[size],
    color: color === 'inherit' ? 'inherit' : theme.vars!.palette[color].main,
  };
});
