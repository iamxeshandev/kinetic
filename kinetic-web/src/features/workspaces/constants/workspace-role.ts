import type { EWorkspaceRole } from '../../../shared/api';

export const workspaceRoleLabelMap: Record<EWorkspaceRole, string> = {
  Member: 'Member',
  Manager: 'Manager',
  Admin: 'Admin',
  Owner: 'Owner',
};

export const workspaceRoleOptions = Object.entries(workspaceRoleLabelMap).map(
  ([value, label]) => ({
    value: value as EWorkspaceRole,
    label,
  }),
);

export const workspaceRoleRankMap: Record<EWorkspaceRole, number> = {
  Member: 1,
  Manager: 2,
  Admin: 3,
  Owner: 4,
};
