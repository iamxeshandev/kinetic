import z from 'zod';
import { PrioritySchema } from '../../../../shared/types';
import { ProjectMemberSchema } from '../../types';

export const SectionSchema = z.object({
  id: z.uuid(),
  name: z.string(),
});
export type Section = z.infer<typeof SectionSchema>;

export const SubtaskSchema = z.object({
  id: z.uuid(),
  taskId: z.uuid(),
  name: z.string(),
});
export type Subtask = z.infer<typeof SubtaskSchema>;

export const TaskAttachmentSchema = z.object({
  id: z.uuid(),
  fileName: z.string(),
  contentType: z.string(),
  size: z.number(),
  downloadUrl: z.string(),
});

export const TaskSchema = z.object({
  id: z.uuid(),
  sectionId: z.uuid(),
  name: z.string(),
  description: z.string().optional(),
  priority: PrioritySchema,
  dueDate: z.date().optional(),
  completedAt: z.date().optional(),
  assignedAt: z.date().optional(),
  assignee: ProjectMemberSchema.optional(),
  subtasks: z.array(SubtaskSchema).optional(),
  attachments: z.array(TaskAttachmentSchema).optional(),
});
export type Task = z.infer<typeof TaskSchema>;

export const TaskFormSchema = z.object({
  sectionId: z.uuid('Section is required'),
  name: z.string().min(1, 'Name is required').max(100, 'Max 100 characters'),
  description: z.string().max(1000, 'Max 1000 characters').optional(),
  priority: PrioritySchema,
  dueDate: z.date().optional(),
  assigneeId: z.uuid('Invalid assignee ID').or(z.literal('')),
});
export type TaskForm = z.infer<typeof TaskFormSchema>;
