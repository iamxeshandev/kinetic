import useSWR, { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';
import { projectsApi, projectsKey } from '../api';
import type { Project } from '../types';

export const useProjects = (workspaceId: string) =>
  useSWR<Project[]>(projectsKey(workspaceId), () =>
    projectsApi.getAll(workspaceId).then((res) => res.data ?? []),
  );

export const useProject = (workspaceId: string, projectId: string) => {
  const { cache } = useSWRConfig();

  const key = projectsKey(workspaceId);

  const cachedProjects = cache.get(key)?.data as Project[] | undefined;

  const {
    data: fetchedProjects,
    isLoading,
    error,
  } = useSWR<Project[]>(cachedProjects ? null : key, () =>
    projectsApi.getAll(workspaceId).then((res) => res.data ?? []),
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
    projectsKey(workspaceId),
    (_, { arg }: { arg: Omit<Project, 'id'> }) =>
      projectsApi.create(workspaceId, arg),
    {
      revalidate: false,
      populateCache: (res, currentData: Project[] = []) =>
        res.data ? [res.data, ...currentData] : currentData,
    },
  );

export const useUpdateProject = (workspaceId: string) =>
  useSWRMutation(
    projectsKey(workspaceId),
    (_, { arg: { id, ...data } }: { arg: Project }) =>
      projectsApi.update(workspaceId, id, data),
    {
      revalidate: false,
      populateCache: (res, currentData: Project[] = []) =>
        currentData.map((project) =>
          project.id === res.data?.id ? res.data : project,
        ),
    },
  );

export const useDeleteProject = (workspaceId: string) =>
  useSWRMutation(
    projectsKey(workspaceId),
    (_, { arg: projectId }: { arg: Project['id'] }) =>
      projectsApi
        .delete(workspaceId, projectId)
        .then((res) => ({ ...res, data: projectId })),
    {
      revalidate: false,
      populateCache: (res, currentData: Project[] = []) =>
        currentData.filter((project) => project.id !== res.data),
    },
  );
