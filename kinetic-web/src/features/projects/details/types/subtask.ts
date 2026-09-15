import z from 'zod';

export const subtaskSchema = z.object({
  id: z.uuid(),
  taskId: z.uuid(),
  name: z.string(),
});

export type Subtask = z.infer<typeof subtaskSchema>;
