import { z } from 'zod';

export const UserFormSchema = z.object({
  email: z
    .email()
    .min(1, 'Email is required')
    .max(100, 'Max 100 characters allowed'),
  role: z.string().min(1, 'Role is required'),
});

export type UserForm = z.infer<typeof UserFormSchema>;
