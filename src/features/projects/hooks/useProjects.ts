import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { PROJECTS_KEY, projectsApi } from '../api/projectsApi';
import { PROJECTS } from '../data/projects';
import type { Project } from '../types/types';

export const useProjects = () =>
  useSWR<Project[]>(
    PROJECTS_KEY,
    () => projectsApi.getAll().then((res) => res.data),
    {
      fallbackData: PROJECTS,
    },
  );

export const useCreateProject = () =>
  useSWRMutation(
    PROJECTS_KEY,
    (_, { arg }: { arg: Project }) =>
      projectsApi.create(arg).then((res) => res.data),
    {
      revalidate: false,
      populateCache: (responseData, currentData: Project[] = []) => [
        ...currentData,
        responseData,
      ],
    },
  );

export const useUpdateProject = () =>
  useSWRMutation(
    PROJECTS_KEY,
    (_, { arg }: { arg: Project }) =>
      projectsApi.update(arg.id, arg).then((res) => res.data),
    {
      revalidate: false,
      populateCache: (responseData, currentData: Project[] = []) =>
        currentData.map((project) =>
          project.id === responseData.id ? responseData : project,
        ),
    },
  );

export const useDeleteProject = () =>
  useSWRMutation(
    PROJECTS_KEY,
    (_, { arg }: { arg: Project['id'] }) =>
      projectsApi.delete(arg).then(() => arg),
    {
      revalidate: false,
      populateCache: (deletedId, currentData: Project[] = []) =>
        currentData.filter((project) => project.id !== deletedId),
    },
  );
