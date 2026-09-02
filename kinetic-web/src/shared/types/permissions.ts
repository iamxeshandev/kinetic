import z from 'zod';

export const WorkspaceRoleSchema = z.enum([
  'Member',
  'Admin',
  'Manager',
  'Owner',
]);

export type WorkspaceRole = z.infer<typeof WorkspaceRoleSchema>;

export const WORKSPACE_RANKS: Record<WorkspaceRole, number> = {
  Owner: 4,
  Admin: 3,
  Manager: 2,
  Member: 1,
};

export const ProjectRoleSchema = z.enum(['Owner', 'Lead', 'Member']);

export type ProjectRole = z.infer<typeof ProjectRoleSchema>;

export const PROJECT_RANKS: Record<ProjectRole, number> = {
  Owner: 3,
  Lead: 2,
  Member: 1,
};
