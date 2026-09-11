import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { sectionsApi, sectionsKey } from '../api';
import type { Section } from '../types';

export const useSections = (workspaceId: string, projectId: string) =>
  useSWR<Section[]>(
    sectionsKey(workspaceId, projectId),
    () =>
      sectionsApi.getAll(workspaceId, projectId).then((res) => res.data ?? []),
    {
      fallbackData: [],
    },
  );

export const useCreateSection = (workspaceId: string, projectId: string) =>
  useSWRMutation(
    sectionsKey(workspaceId, projectId),
    (_, { arg }: { arg: Omit<Section, Section['id']> }) =>
      sectionsApi.create(workspaceId, projectId, arg),
    {
      revalidate: false,
      populateCache: (res, currentData: Section[] = []) =>
        res.data ? [...currentData, res.data] : currentData,
    },
  );

export const useUpdateSection = (workspaceId: string, projectId: string) =>
  useSWRMutation(
    sectionsKey(workspaceId, projectId),
    (_, { arg: { id, ...data } }: { arg: Section }) =>
      sectionsApi.update(workspaceId, projectId, id, data),
    {
      revalidate: false,
      populateCache: (res, currentData: Section[] = []) =>
        currentData.map((section) =>
          section.id === res.data?.id ? res.data : section,
        ),
    },
  );

export const useDeleteSection = (workspaceId: string, projectId: string) =>
  useSWRMutation(
    sectionsKey(workspaceId, projectId),
    (
      _,
      {
        arg: { sectionId, moveTasksTo, deleteTasks },
      }: {
        arg: {
          sectionId: Section['id'];
          moveTasksTo?: Section['id'];
          deleteTasks?: boolean;
        };
      },
    ) =>
      sectionsApi
        .delete(workspaceId, projectId, sectionId, moveTasksTo, deleteTasks)
        .then((res) => ({ ...res, data: sectionId })),
    {
      revalidate: false,
      populateCache: (res, currentData: Section[] = []) =>
        currentData.filter((section) => section.id !== res.data),
    },
  );
