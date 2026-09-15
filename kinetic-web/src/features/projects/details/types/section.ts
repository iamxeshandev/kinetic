import z from 'zod';

export const sectionSchema = z.object({
  id: z.uuid(),
  name: z.string(),
});

export type Section = z.infer<typeof sectionSchema>;
