import { Box, type BoxProps } from '@mui/material';
import logoImg from '../../assets/logo.svg';

export function Logo({ sx, ...props }: BoxProps) {
  return (
    <Box
      component={'img'}
      src={logoImg}
      alt='App logo'
      sx={{ width: 50, ...sx }}
      {...props}
    />
  );
}
