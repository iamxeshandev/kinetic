import { Navigate } from 'react-router';
import { useAuthContext } from '../../features/auth/context';
import { paths } from '../../routes';

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuthContext();

  if (user) {
    return (
      <Navigate
        to={
          user.activeWorkspace
            ? paths.workspaces.dashboard(user.activeWorkspace.id)
            : paths.workspaces.root
        }
        replace
      />
    );
  }

  return <>{children}</>;
}
