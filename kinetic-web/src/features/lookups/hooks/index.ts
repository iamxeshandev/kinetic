import useSWR from 'swr';
import { api, type ApiResponse } from '../../../shared/api';

type Lookup = {
  value: string;
  label: string;
};

type Category =
  | 'priorities'
  | 'project-roles'
  | 'project-statuses'
  | 'workspace-roles';

export const useLookups = (category: Category) =>
  useSWR(
    `api/lookups/${category}`,
    () =>
      api
        .get<ApiResponse<Lookup[]>>(`api/lookups/${category}`)
        .then((res) => res.data?.data ?? []),
    {
      revalidateOnFocus: false,
      fallbackData: [],
    },
  );
