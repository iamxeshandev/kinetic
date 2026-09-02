import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { projectsApi, projectsUrl, projectUrl } from '../api';
import type { Project } from '../types';

export const useProjects = (workspaceId: string) =>
  useSWR(
    projectsUrl(workspaceId),
    () => projectsApi.getAll(workspaceId).then((res) => res.data),
    {
      fallbackData: [],
    },
  );

export const useProject = (workspaceId: string, projectId: Project['id']) =>
  useSWR(projectUrl(workspaceId, projectId), () =>
    projectsApi.getById(workspaceId, projectId).then((res) => res.data),
  );

export const useCreateProject = (workspaceId: string) =>
  useSWRMutation(
    projectsUrl(workspaceId),
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
    projectsUrl(workspaceId),
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
    projectsUrl(workspaceId),
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
