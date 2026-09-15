import z from 'zod';

export const workspaceRoleSchema = z.enum([
  'Member',
  'Manager',
  'Admin',
  'Owner',
]);

export type WorkspaceRole = z.infer<typeof workspaceRoleSchema>;

export const workspaceRoleLabelMap: Record<WorkspaceRole, string> = {
  Member: 'Member',
  Manager: 'Manager',
  Admin: 'Admin',
  Owner: 'Owner',
};

export const workspaceRoleOptions = Object.entries(workspaceRoleLabelMap).map(
  ([value, label]) => ({
    value: value as WorkspaceRole,
    label,
  }),
);

export const workspaceRoleRankMap: Record<WorkspaceRole, number> = {
  Member: 1,
  Manager: 2,
  Admin: 3,
  Owner: 4,
};
