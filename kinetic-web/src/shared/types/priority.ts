import z from 'zod';

export const prioritySchema = z.enum(['None', 'Low', 'Medium', 'High']);

export type Priority = z.infer<typeof prioritySchema>;

export const priorityLabelMap: Record<Priority, string> = {
  None: 'None',
  Low: 'Low',
  Medium: 'Medium',
  High: 'High',
};

export const priorityOptions = Object.entries(priorityLabelMap).map(
  ([value, label]) => ({
    value: value as Priority,
    label,
  }),
);
