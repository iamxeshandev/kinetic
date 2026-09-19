import useSWR, { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
  type ProjectDto,
  type ProjectRequest,
} from '../../../shared/api';

const KEY = (workspaceId: string) => `api/workspaces/${workspaceId}/projects`;

export const useProjects = (workspaceId: string) =>
  useSWR<ProjectDto[]>(KEY(workspaceId), () =>
    getProjects({ path: { workspaceId } }).then((res) => res.data.data ?? []),
  );

export const useProject = (workspaceId: string, projectId: string) => {
  const { cache } = useSWRConfig();

  const key = KEY(workspaceId);

  const cachedProjects = cache.get(key)?.data as ProjectDto[] | undefined;

  const {
    data: fetchedProjects,
    isLoading,
    error,
  } = useSWR<ProjectDto[]>(cachedProjects ? null : key, () =>
    getProjects({ path: { workspaceId } }).then((res) => res.data.data ?? []),
  );

  const projects = cachedProjects ?? fetchedProjects;

  return {
    data: projects?.find((p) => p.id === projectId),
    isLoading,
    error,
  };
};

export const useCreateProject = (workspaceId: string) =>
  useSWRMutation(
    KEY(workspaceId),
    (_, { arg }: { arg: ProjectRequest }) =>
      createProject({ path: { workspaceId }, body: arg }).then(
        (res) => res.data,
      ),
    {
      revalidate: false,
      populateCache: (res, currentData: ProjectDto[] = []) =>
        res.data ? [res.data, ...currentData] : currentData,
    },
  );

export const useUpdateProject = (workspaceId: string, projectId: string) =>
  useSWRMutation(
    KEY(workspaceId),
    (_, { arg }: { arg: ProjectRequest }) =>
      updateProject({ path: { workspaceId, projectId }, body: arg }).then(
        (res) => res.data,
      ),
    {
      revalidate: false,
      populateCache: (res, currentData: ProjectDto[] = []) =>
        currentData.map((project) =>
          project.id === res.data?.id ? res.data : project,
        ),
    },
  );

export const useDeleteProject = (workspaceId: string, projectId: string) =>
  useSWRMutation(
    KEY(workspaceId),
    () =>
      deleteProject({ path: { workspaceId, projectId } }).then(
        (res) => res.data,
      ),
    {
      revalidate: false,
      populateCache: (_, currentData: ProjectDto[] = []) =>
        currentData.filter((project) => project.id !== projectId),
    },
  );
