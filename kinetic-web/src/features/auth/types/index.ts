import z from 'zod';
import { workspaceSchema } from '../../workspaces/types/workspace';

export const MeSchema = z.object({
  id: z.uuid(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string().nullish(),
  fullName: z.string(),
  currentWorkspace: workspaceSchema.optional(),
});

export type Me = z.infer<typeof MeSchema>;
