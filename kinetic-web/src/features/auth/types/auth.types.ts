import z from 'zod';

export const UserSchema = z.object({
  id: z.uuid(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string().nullish(),
  fullName: z.string(),
  defaultWorkspaceId: z.string(),
});

export type User = z.infer<typeof UserSchema>;
