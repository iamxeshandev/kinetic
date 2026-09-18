import type { EProjectStatus } from '../../../shared/api';

export const projectStatusLabelMap: Record<EProjectStatus, string> = {
  Planning: 'Planning',
  Active: 'Active',
  OnHold: 'On Hold',
  Archived: 'Archived',
};

export const projectStatusOptions = Object.entries(projectStatusLabelMap).map(
  ([value, label]) => ({
    value: value as EProjectStatus,
    label,
  }),
);
