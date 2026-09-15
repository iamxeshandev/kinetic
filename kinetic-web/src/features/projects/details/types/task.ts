import z from 'zod';
import { prioritySchema } from '../../../../shared/types';
import { projectMemberSchema } from '../../types';
import { subtaskSchema } from './subtask';
import { taskAttachmentSchema } from './task-attachment';

export const taskSchema = z.object({
  id: z.uuid(),
  sectionId: z.uuid(),
  name: z.string(),
  description: z.string().optional(),
  priority: prioritySchema,
  dueDate: z.date().optional(),
  completedAt: z.date().optional(),
  assignedAt: z.date().optional(),
  assignee: projectMemberSchema.optional(),
  subtasks: z.array(subtaskSchema).optional(),
  attachments: z.array(taskAttachmentSchema).optional(),
});

export type Task = z.infer<typeof taskSchema>;
