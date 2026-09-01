import { Container } from '@mui/material';
import { Outlet } from 'react-router';
import { Header } from './components/Header';

export function AccountLayout() {
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
        <Outlet />
      </Container>
    </>
  );
}

export { AccountLayout as Component };
