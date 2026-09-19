import type { EWorkspaceRole } from '../../../shared/api';
import { workspaceRoleRankMap } from '../constants';

export const hasWorkspaceRole = (
  currentRole: EWorkspaceRole = 'Member',
  minimumRequiredRole: EWorkspaceRole,
) =>
  workspaceRoleRankMap[currentRole] >=
  workspaceRoleRankMap[minimumRequiredRole];
