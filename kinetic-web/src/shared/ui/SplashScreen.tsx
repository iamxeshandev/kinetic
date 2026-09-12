import { Box } from '@mui/material';
import { motion } from 'motion/react';
import { Logo } from './Logo';

export function SplashScreen() {
  return (
    <Box
      sx={{
        width: '100dvw',
        height: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        component={motion.div}
        animate={{ scale: [0.8, 1, 0.8], opacity: [1, 0, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
        sx={{ m: 'auto' }}
      >
        <Logo isLink={false} sx={{ width: { xs: 100, md: 200 } }} />
      </Box>
    </Box>
  );
}
