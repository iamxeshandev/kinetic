import z from 'zod';
import { prioritySchema } from '../../../../shared/types';

export const taskFormSchema = z.object({
  sectionId: z.uuid('Section is required'),
  name: z.string().min(1, 'Name is required').max(100, 'Max 100 characters'),
  description: z.record(z.string(), z.unknown()).nullable(),
  priority: prioritySchema,
  dueDate: z.date().nullable(),
  assigneeId: z.uuid('Invalid assignee ID').or(z.literal('')),
});

export type TaskForm = z.infer<typeof taskFormSchema>;
