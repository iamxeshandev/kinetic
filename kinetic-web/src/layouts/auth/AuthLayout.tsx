import { Box, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'motion/react';
import { useLocation, useOutlet } from 'react-router';

export function AuthLayout() {
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <>
      <Container
        component={'main'}
        sx={{ justifyContent: 'center', alignItems: 'center', p: 3 }}
      >
        <AnimatePresence mode='wait'>
          <Box
            key={location.pathname}
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: 1,
            }}
          >
            {outlet}
          </Box>
        </AnimatePresence>
      </Container>
    </>
  );
}

export { AuthLayout as Component };
