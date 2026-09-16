import z from 'zod';
import { prioritySchema } from '../../../../shared/types';
import { projectMemberSchema } from '../../types';
import { subtaskSchema } from './subtask';
import { taskAttachmentSchema } from './task-attachment';

export const taskSchema = z.object({
  id: z.uuid(),
  sectionId: z.uuid(),
  name: z.string(),
  description: z.record(z.string(), z.unknown()).nullish(),
  priority: prioritySchema,
  dueDate: z.date().nullish(),
  completedAt: z.date().nullish(),
  assignedAt: z.date().nullish(),
  assignee: projectMemberSchema.nullish(),
  subtasks: z.array(subtaskSchema).nullish(),
  attachments: z.array(taskAttachmentSchema).nullish(),
});

export type Task = z.infer<typeof taskSchema>;
