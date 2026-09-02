import { useAuthContext } from '../../features/auth/context';
import { WORKSPACE_RANKS, type WorkspaceRole } from '../types';

// * This component is used to conditionally render children based on the user's role

export type CanProps = {
  children: React.ReactNode;
  role: WorkspaceRole;
};

export function Can({ role, children }: CanProps) {
  const { user } = useAuthContext();
  const userRank = WORKSPACE_RANKS[user?.currentWorkspace?.role ?? 'Member'];
  const allowedRank = WORKSPACE_RANKS[role];

  return userRank >= allowedRank ? children : null;
}
