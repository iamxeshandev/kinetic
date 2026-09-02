import z from 'zod';

export const ProjectMemberSchema = z.object({
  id: z.uuid(),
  fullName: z.string(),
  email: z.email(),
  role: z.enum(['Owner', 'Lead', 'Member']),
});
export type ProjectMember = z.infer<typeof ProjectMemberSchema>;

export const ProjectSchema = z.object({
  id: z.uuid(),
  name: z.string().max(100, 'Max 100 characters allowed'),
  description: z.string().max(1000, 'Max 1000 characters allowed'),
  status: z.string(),
  priority: z.string(),
  dueDate: z.date().nullable(),
  isFavorite: z.boolean(),
  team: z.array(ProjectMemberSchema),
});
export type Project = z.infer<typeof ProjectSchema>;

export const ProjectFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Max 100 characters allowed'),
  description: z.string().max(1000, 'Max 1000 characters allowed'),
  status: z.string().min(1, 'Status is required'),
  priority: z.string().min(1, 'Priority is required'),
  dueDate: z.date().nullable(),
  isFavorite: z.boolean(),
  leads: z.array(z.object({ id: z.uuid(), label: z.string() })),
  members: z.array(z.object({ id: z.uuid(), label: z.string() })),
});
export type ProjectForm = z.infer<typeof ProjectFormSchema>;
