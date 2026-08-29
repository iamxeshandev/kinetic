import { Box, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'motion/react';
import { Navigate, useLocation, useOutlet } from 'react-router';
import { getUserSession } from '../../features/auth/helpers';
import { paths } from '../../routes';

export function AuthLayout() {
  const location = useLocation();
  const outlet = useOutlet();

  const user = getUserSession();

  return user ? (
    <Navigate
      to={paths.workspaces(user.defaultWorkspaceId).dashboard}
      replace
    />
  ) : (
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
