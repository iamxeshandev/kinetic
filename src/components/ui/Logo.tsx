import { Box, type BoxProps } from '@mui/material';
import logoImg from '../../assets/logo.svg';

export function Logo(props: BoxProps) {
  return (
    <Box
      component={'img'}
      src={logoImg}
      alt='App logo'
      {...props}
      sx={{ width: 50, ...props.sx }}
    />
  );
}
