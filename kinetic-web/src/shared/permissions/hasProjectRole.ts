import { PROJECT_RANKS, type ProjectRole } from '../types';

export const hasProjectRole = (role: ProjectRole, minRole: ProjectRole) =>
  (PROJECT_RANKS[role] ?? 0) >= PROJECT_RANKS[minRole];
