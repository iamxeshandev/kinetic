import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { projectsApi, projectsKey } from '../api/projectsApi';
import type { Project, ProjectForm } from '../types/project.types';

export const useProjects = (workspaceId: string) =>
  useSWR<Project[]>(
    projectsKey(workspaceId),
    () => projectsApi.getAll(workspaceId).then((res) => res.data),
    {
      fallbackData: [],
    },
  );

export const useCreateProject = (workspaceId: string) =>
  useSWRMutation(
    projectsKey(workspaceId),
    (_, { arg }: { arg: ProjectForm }) => projectsApi.create(workspaceId, arg),
    {
      revalidate: false,
      populateCache: (res, currentData: Project[] = []) => [
        ...currentData,
        res.data,
      ],
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
          project.id === res.data.id ? res.data : project,
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
