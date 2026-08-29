import { z } from 'zod';

export const UserSchema = z.object({
  id: z.uuid(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string().nullish(),
  fullName: z.string(),
  role: z.string(),
  joinedAt: z.date(),
});
export type User = z.infer<typeof UserSchema>;
