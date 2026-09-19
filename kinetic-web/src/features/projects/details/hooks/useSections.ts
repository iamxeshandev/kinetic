import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import {
  createSection,
  deleteSection,
  getSections,
  updateSection,
  type SectionDto,
  type SectionRequest,
} from '../../../../shared/api';

const KEY = (workspaceId: string, projectId: string) =>
  `workspaces/${workspaceId}/projects/${projectId}/sections`;

export const useSections = (workspaceId: string, projectId: string) =>
  useSWR<SectionDto[]>(KEY(workspaceId, projectId), () =>
    getSections({ path: { workspaceId, projectId } }).then(
      (res) => res.data.data ?? [],
    ),
  );

export const useCreateSection = (workspaceId: string, projectId: string) =>
  useSWRMutation(
    KEY(workspaceId, projectId),
    (_, { arg }: { arg: SectionRequest }) =>
      createSection({ path: { workspaceId, projectId }, body: arg }).then(
        (res) => res.data,
      ),
    {
      revalidate: false,
      populateCache: (res, currentData: SectionDto[] = []) =>
        res.data ? [...currentData, res.data] : currentData,
    },
  );

export const useUpdateSection = (
  workspaceId: string,
  projectId: string,
  sectionId: string,
) =>
  useSWRMutation(
    KEY(workspaceId, projectId),
    (_, { arg }: { arg: SectionRequest }) =>
      updateSection({
        path: { workspaceId, projectId, sectionId },
        body: arg,
      }).then((res) => res.data),
    {
      revalidate: false,
      populateCache: (res, currentData: SectionDto[] = []) =>
        currentData.map((section) =>
          section.id === res.data?.id ? res.data : section,
        ),
    },
  );

export const useDeleteSection = (
  workspaceId: string,
  projectId: string,
  sectionId: string,
  moveTasksTo?: string,
  deleteTasks?: boolean,
) =>
  useSWRMutation(
    KEY(workspaceId, projectId),
    () =>
      deleteSection({
        path: { workspaceId, projectId, sectionId },
        query: { moveTasksTo, deleteTasks },
      }).then((res) => res.data),
    {
      revalidate: false,
      populateCache: (_, currentData: SectionDto[] = []) =>
        currentData.filter((section) => section.id !== sectionId),
    },
  );
