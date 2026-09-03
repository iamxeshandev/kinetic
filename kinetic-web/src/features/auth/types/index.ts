import z from 'zod';
import { WorkspaceSchema } from '../../workspaces/types';

export const LoginResponseSchema = z.object({
  id: z.uuid(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string().nullish(),
  fullName: z.string(),
  currentWorkspace: WorkspaceSchema.optional(),
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;
