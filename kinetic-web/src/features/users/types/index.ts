import { z } from 'zod';
import { WorkspaceRoleSchema } from '../../../shared/types';

export const UserSchema = z.object({
  id: z.uuid(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string().nullish(),
  fullName: z.string(),
  role: WorkspaceRoleSchema,
  joinedAt: z.date(),
});
export type User = z.infer<typeof UserSchema>;

export const UserFormSchema = z.object({
  email: z
    .email()
    .min(1, 'Email is required')
    .max(100, 'Max 100 characters allowed'),
  role: z.string().min(1, 'Role is required'),
});
export type UserForm = z.infer<typeof UserFormSchema>;
