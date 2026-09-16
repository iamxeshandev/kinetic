import type { components } from '../../../shared/api/types';

export type ProjectRole = components['schemas']['EProjectRole'];

export const projectRoleLabelMap: Record<ProjectRole, string> = {
  Member: 'Member',
  Lead: 'Lead',
  Owner: 'Owner',
};

export const projectRoleOptions = Object.entries(projectRoleLabelMap).map(
  ([value, label]) => ({
    value: value as ProjectRole,
    label,
  }),
);

export const projectRoleRankMap: Record<ProjectRole, number> = {
  Member: 1,
  Lead: 2,
  Owner: 3,
};
