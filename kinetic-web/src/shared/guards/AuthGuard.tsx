import { Navigate } from 'react-router';
import { useAuthContext } from '../../features/auth/context';
import { paths } from '../../routes';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuthContext();

  if (!user) {
    return <Navigate to={paths.auth.signIn} replace />;
  }

  return <>{children}</>;
}
