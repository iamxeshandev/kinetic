import type { EPriority } from '../api';

export const priorityLabelMap: Record<EPriority, string> = {
  None: 'None',
  Low: 'Low',
  Medium: 'Medium',
  High: 'High',
};

export const priorityOptions = Object.entries(priorityLabelMap).map(
  ([value, label]) => ({
    value: value as EPriority,
    label,
  }),
);
