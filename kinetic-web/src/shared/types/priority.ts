import z from 'zod';

export const PrioritySchema = z.enum(['None', 'Low', 'Medium', 'High']);
export type Priority = z.infer<typeof PrioritySchema>;
