import z from 'zod';
import { workspaceRoleSchema } from './workspace-role';

export const workspaceSchema = z.object({
  id: z.uuid(),
  name: z.string().max(100, 'Max 100 characters allowed'),
  role: workspaceRoleSchema,
  isPersonal: z.boolean(),
  members: z.number(),
});

export type Workspace = z.infer<typeof workspaceSchema>;
