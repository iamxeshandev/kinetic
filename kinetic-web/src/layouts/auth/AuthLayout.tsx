import { Container } from '@mui/material';
import type { PropsWithChildren } from 'react';

export function AuthLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Container
        component={'main'}
        sx={{ justifyContent: 'center', alignItems: 'center', p: 3 }}
      >
        {children}
      </Container>
    </>
  );
}
