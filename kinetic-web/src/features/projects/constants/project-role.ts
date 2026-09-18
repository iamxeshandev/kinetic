import type { EProjectRole } from '../../../shared/api';

export const projectRoleLabelMap: Record<EProjectRole, string> = {
  Member: 'Member',
  Lead: 'Lead',
  Owner: 'Owner',
};

export const projectRoleOptions = Object.entries(projectRoleLabelMap).map(
  ([value, label]) => ({
    value: value as EProjectRole,
    label,
  }),
);

export const projectRoleRankMap: Record<EProjectRole, number> = {
  Member: 1,
  Lead: 2,
  Owner: 3,
};
