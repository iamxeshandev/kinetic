import { Box, type BoxProps } from '@mui/material';

export function Logo(props: BoxProps) {
  return (
    <Box
      component={'img'}
      src='\src\assets\logo.svg'
      alt='App logo'
      {...props}
      sx={{ width: 50, ...props.sx }}
    />
  );
}
