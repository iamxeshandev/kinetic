import z from 'zod';

export const projectStatusSchema = z.enum([
  'Planning',
  'Active',
  'OnHold',
  'Archived',
]);

export type ProjectStatus = z.infer<typeof projectStatusSchema>;

export const projectStatusLabelMap: Record<ProjectStatus, string> = {
  Planning: 'Planning',
  Active: 'Active',
  OnHold: 'On Hold',
  Archived: 'Archived',
};

export const projectStatusOptions = Object.entries(projectStatusLabelMap).map(
  ([value, label]) => ({
    value: value as ProjectStatus,
    label,
  }),
);
