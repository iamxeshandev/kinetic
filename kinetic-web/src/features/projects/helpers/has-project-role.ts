import { projectRoleRankMap, type ProjectRole } from '../constants';

export const hasProjectRole = (
  currentRole: ProjectRole | undefined = 'Member',
  minimumRequiredRole: ProjectRole,
) => projectRoleRankMap[currentRole] >= projectRoleRankMap[minimumRequiredRole];
