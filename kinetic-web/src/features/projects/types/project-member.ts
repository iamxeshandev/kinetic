import z from 'zod';
import { projectRoleSchema } from './project-role';

export const projectMemberSchema = z.object({
  id: z.uuid('Invalid ID'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().optional(),
  email: z.email('Invalid email'),
  avatarUrl: z.string().optional(),
  role: projectRoleSchema,
});

export type ProjectMember = z.infer<typeof projectMemberSchema>;
