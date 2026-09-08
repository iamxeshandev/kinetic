import z from 'zod';

export const ProjectMemberSchema = z.object({
  id: z.uuid('Invalid ID'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().optional(),
  email: z.email('Invalid email'),
  avatarUrl: z.string().optional(),
  role: z.string().min(1, 'Role is required'),
});
export type ProjectMember = z.infer<typeof ProjectMemberSchema>;

export const ProjectSchema = z.object({
  id: z.uuid('Invalid ID'),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Max 100 characters allowed'),
  description: z.string().max(1000, 'Max 1000 characters allowed').optional(),
  status: z.string().min(1, 'Status is required'),
  priority: z.string().min(1, 'Priority is required'),
  dueDate: z.date().optional(),
  isFavorite: z.boolean(),
  team: z.array(ProjectMemberSchema),
});
export type Project = z.infer<typeof ProjectSchema>;

export const ProjectFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Max 100 characters allowed'),
  description: z.string().max(1000, 'Max 1000 characters allowed').optional(),
  status: z.string().min(1, 'Status is required'),
  priority: z.string().min(1, 'Priority is required'),
  dueDate: z.date().optional(),
  leads: z.array(z.object({ id: z.uuid(), label: z.string() })),
  members: z.array(z.object({ id: z.uuid(), label: z.string() })),
});
export type ProjectForm = z.infer<typeof ProjectFormSchema>;
