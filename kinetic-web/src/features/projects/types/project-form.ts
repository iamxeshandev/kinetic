import z from 'zod';

export const projectFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Max 100 characters allowed'),
  description: z.string().max(1000, 'Max 1000 characters allowed').optional(),
  status: z.string().min(1, 'Status is required'),
  priority: z.string().min(1, 'Priority is required'),
  dueDate: z.date().optional(),
  leads: z.array(
    z.object({
      id: z.uuid(),
      firstName: z.string(),
      lastName: z.string().optional(),
    }),
  ),
  members: z.array(
    z.object({
      id: z.uuid(),
      firstName: z.string(),
      lastName: z.string().optional(),
    }),
  ),
});

export type ProjectForm = z.infer<typeof projectFormSchema>;
