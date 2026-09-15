import z from 'zod';

export const taskAttachmentSchema = z.object({
  id: z.uuid(),
  fileName: z.string(),
  contentType: z.string(),
  size: z.number(),
  downloadUrl: z.string(),
});

export type TaskAttachment = z.infer<typeof taskAttachmentSchema>;
