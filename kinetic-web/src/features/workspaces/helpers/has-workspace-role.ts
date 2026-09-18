import { workspaceRoleRankMap, type WorkspaceRole } from '../constants';

export const hasWorkspaceRole = (
  currentRole: WorkspaceRole | undefined = 'Member',
  minimumRequiredRole: WorkspaceRole,
) =>
  workspaceRoleRankMap[currentRole] >=
  workspaceRoleRankMap[minimumRequiredRole];
