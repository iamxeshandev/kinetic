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
    (_, { arg }: { arg: { id: string } & ProjectForm }) =>
      projectsApi.update(workspaceId, arg.id, arg),
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
    (_, { arg }: { arg: Project['id'] }) =>
      projectsApi
        .delete(workspaceId, arg)
        .then((res) => ({ ...res, data: arg })),
    {
      revalidate: false,
      populateCache: (res, currentData: Project[] = []) =>
        currentData.filter((project) => project.id !== res.data),
    },
  );
