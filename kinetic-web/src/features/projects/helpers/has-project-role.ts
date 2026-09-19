import type { EProjectRole } from '../../../shared/api';
import { projectRoleRankMap } from '../constants';

export const hasProjectRole = (
  currentRole: EProjectRole,
  minimumRequiredRole: EProjectRole,
) => projectRoleRankMap[currentRole] >= projectRoleRankMap[minimumRequiredRole];
