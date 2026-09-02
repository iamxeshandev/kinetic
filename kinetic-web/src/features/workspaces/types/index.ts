import z from 'zod';
import { WorkspaceRoleSchema } from '../../../shared/types';

export const WorkspaceSchema = z.object({
  id: z.uuid(),
  name: z.string().max(100, 'Max 100 characters allowed'),
  role: WorkspaceRoleSchema,
  isPersonal: z.boolean(),
  members: z.number(),
});
export type Workspace = z.infer<typeof WorkspaceSchema>;

export const WorkspaceFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Max 100 characters allowed'),
});
export type WorkspaceForm = z.infer<typeof WorkspaceFormSchema>;
