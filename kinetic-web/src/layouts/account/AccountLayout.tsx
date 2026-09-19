import { Container } from '@mui/material';
import type { PropsWithChildren } from 'react';
import { Header } from './components/Header';

export function AccountLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Header />

      <Container
        maxWidth='xl'
        component={'main'}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          py: 2,
        }}
      >
        {children}
      </Container>
    </>
  );
}
