import { Navigate, useParams } from 'react-router';
import { useAuthContext } from '../../features/auth/context';
import { paths } from '../../routes';

export function WorkspaceGuard({ children }: { children: React.ReactNode }) {
  const { workspaceId } = useParams();

  const { user } = useAuthContext();

  const activeWorkspaceId = user?.activeWorkspace?.id;

  if (!activeWorkspaceId)
    return <Navigate to={paths.workspaces.root} replace />;

  if (activeWorkspaceId !== workspaceId)
    return (
      <Navigate to={paths.workspaces.dashboard(activeWorkspaceId)} replace />
    );

  return children;
}
