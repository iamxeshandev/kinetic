import { Container } from '@mui/material';
import { Navigate, Outlet } from 'react-router';
import { useAuthContext } from '../../features/auth/context/useAuthContext';
import { paths } from '../../routes';

export function AuthLayout() {
  const { user } = useAuthContext();

  if (user) return <Navigate to={paths.dashboard.root} replace />;

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
