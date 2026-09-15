import { workspaceRoleRankMap, type WorkspaceRole } from '../types';

export const hasWorkspaceRole = (
  currentRole: WorkspaceRole | undefined = 'Member',
  minimumRequiredRole: WorkspaceRole,
) =>
  workspaceRoleRankMap[currentRole] >=
  workspaceRoleRankMap[minimumRequiredRole];
