import { projectRoleRankMap, type ProjectRole } from '../types';

export const hasProjectRole = (
  currentRole: ProjectRole | undefined = 'Member',
  minimumRequiredRole: ProjectRole,
) => projectRoleRankMap[currentRole] >= projectRoleRankMap[minimumRequiredRole];
