import { Outlet } from 'react-router';
import { WorkspaceLayout } from '../../layouts/workspace';
import { AuthGuard, WorkspaceGuard } from '../guards';

export function Component() {
  return (
    <AuthGuard>
      <WorkspaceGuard>
        <WorkspaceLayout>
          <Outlet />
        </WorkspaceLayout>
      </WorkspaceGuard>
    </AuthGuard>
  );
}
