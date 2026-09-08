import { Box, type BoxProps } from '@mui/material';
import type { IconType } from 'react-icons/lib';
import type { ColorToken } from '../../../theme';

const sizes = {
  small: 16,
  medium: 24,
  large: 32,
} as const;

export type StyledIcon2Props = BoxProps & {
  icon: IconType;
  size?: 'small' | 'medium' | 'large';
  color?: ColorToken | 'inherit';
};

export function StyledIcon({
  icon,
  size = 'medium',
  color = 'inherit',
  sx,
  ...props
}: StyledIcon2Props) {
  return (
    <Box
      component={icon}
      sx={{
        fontSize: sizes[size],
        color:
          color === 'inherit'
            ? 'inherit'
            : (theme) => theme.vars!.palette[color].main,
        ...sx,
      }}
      {...props}
    />
  );
}
