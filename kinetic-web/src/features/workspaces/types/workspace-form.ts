import z from 'zod';

export const workspaceFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Max 100 characters allowed'),
});

export type WorkspaceForm = z.infer<typeof workspaceFormSchema>;
