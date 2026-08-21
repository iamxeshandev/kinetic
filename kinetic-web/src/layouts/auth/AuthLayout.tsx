import { Container } from '@mui/material';
import { Outlet } from 'react-router';

export function AuthLayout() {
  return (
    <>
      <Container
        component={'main'}
        sx={{ justifyContent: 'center', alignItems: 'center', p: 3 }}
      >
        <Outlet />
      </Container>
    </>
  );
}

export { AuthLayout as Component };
