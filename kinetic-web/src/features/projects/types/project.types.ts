import z from 'zod';

export const ProjectStatusSchema = z.enum(['Active', 'Completed']);
export type ProjectStatus = z.infer<typeof ProjectStatusSchema>;

export const ProjectPrioritySchema = z.enum(['None', 'Low', 'Medium', 'High']);
export type ProjectPriority = z.infer<typeof ProjectPrioritySchema>;

export const ProjectSchema = z.object({
  id: z.uuid(),
  name: z.string().max(100, 'Max 100 characters allowed'),
  description: z.string().max(1000, 'Max 1000 characters allowed'),
  status: ProjectStatusSchema,
  priority: ProjectPrioritySchema,
  dueDate: z.date().nullable(),
  isFavorite: z.boolean(),
});
export type Project = z.infer<typeof ProjectSchema>;

export const ProjectFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Max 100 characters allowed'),
  description: z.string().max(1000, 'Max 1000 characters allowed'),
  status: ProjectStatusSchema,
  priority: ProjectPrioritySchema,
  dueDate: z.date().nullable(),
  isFavorite: z.boolean(),
});
export type ProjectForm = z.infer<typeof ProjectFormSchema>;
