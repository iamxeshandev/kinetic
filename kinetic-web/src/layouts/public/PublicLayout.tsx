import { Container } from '@mui/material';
import { Outlet } from 'react-router';
import { Footer } from './components/Footer';
import { Header } from './components/Header';

export function PublicLayout() {
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
        <Outlet />
      </Container>
      <Footer />
    </>
  );
}

export { PublicLayout as Component };
