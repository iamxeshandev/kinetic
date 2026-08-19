import { Container } from '@mui/material';
import { Outlet } from 'react-router';
import { Footer } from './components/Footer';
import { Header } from './components/Header';

export function MainLayout() {
  return (
    <>
      <Header />
      <Container component={'main'}>
        <Outlet />
      </Container>
      <Footer />
    </>
  );
}

export { MainLayout as Component };
