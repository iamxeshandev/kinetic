import { WORKSPACE_RANKS, type WorkspaceRole } from '../types';

export const hasWorkspaceRole = (role: WorkspaceRole, minRole: WorkspaceRole) =>
  (WORKSPACE_RANKS[role] ?? 0) >= WORKSPACE_RANKS[minRole];
