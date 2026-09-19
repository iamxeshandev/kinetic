import { Container } from '@mui/material';
import type { PropsWithChildren } from 'react';
import { Footer } from './components/Footer';
import { Header } from './components/Header';

export function PublicLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Header />

      <Container
        component={'main'}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          p: 2,
        }}
      >
        {children}
      </Container>

      <Footer />
    </>
  );
}
