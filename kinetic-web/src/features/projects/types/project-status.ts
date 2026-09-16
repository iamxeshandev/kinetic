import type { components } from '../../../shared/api/types';

export type ProjectStatus = components['schemas']['EProjectStatus'];

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
