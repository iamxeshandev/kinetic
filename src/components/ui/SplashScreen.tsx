import { Box } from '@mui/material';
import { Logo } from './Logo';

export function SplashScreen() {
  return (
    <Box
      component={'main'}
      sx={{ justifyContent: 'center', alignItems: 'center' }}
    >
      <Logo />
    </Box>
  );
}
