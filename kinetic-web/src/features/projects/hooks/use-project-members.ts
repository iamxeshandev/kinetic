import useSWR from 'swr';
import { getProjectMembers, type ProjectMemberDto } from '../../../shared/api';

const KEY = (workspaceId: string, projectId: string) =>
  `api/workspaces/${workspaceId}/projects/${projectId}/members`;

export const useProjectMembers = (workspaceId: string, projectId: string) =>
  useSWR<ProjectMemberDto[]>(KEY(workspaceId, projectId), () =>
    getProjectMembers({ path: { workspaceId, projectId } }).then(
      (res) => res.data.data ?? [],
    ),
  );
