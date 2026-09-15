import { Navigate, useParams } from 'react-router';
import { useAuthContext } from '../../features/auth/context';
import { paths } from '../../routes';

export function WorkspaceGuard({ children }: { children: React.ReactNode }) {
  const { workspaceId } = useParams();

  const { user } = useAuthContext();

  const currentWorkspace = user?.currentWorkspace;

  if (!currentWorkspace) return <Navigate to={paths.workspaces.root} replace />;

  if (currentWorkspace.id !== workspaceId)
    return (
      <Navigate to={paths.workspaces.dashboard(currentWorkspace.id)} replace />
    );

  return children;
}
