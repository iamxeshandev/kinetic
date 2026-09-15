import z from 'zod';
import { projectMemberSchema } from './project-member';

export const projectSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string().optional(),
  status: z.string(),
  priority: z.string(),
  dueDate: z.date().optional(),
  isFavorite: z.boolean(),
  team: z.array(projectMemberSchema),
});

export type Project = z.infer<typeof projectSchema>;
