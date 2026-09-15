import z from 'zod';
import { prioritySchema } from '../../../../shared/types';

export const taskFormSchema = z.object({
  sectionId: z.uuid('Section is required'),
  name: z.string().min(1, 'Name is required').max(100, 'Max 100 characters'),
  description: z.string().max(1000, 'Max 1000 characters').optional(),
  priority: prioritySchema,
  dueDate: z.date().optional(),
  assigneeId: z.uuid('Invalid assignee ID').or(z.literal('')),
});

export type TaskForm = z.infer<typeof taskFormSchema>;
