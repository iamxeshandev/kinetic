import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { workspacesApi, workspacesKey } from '../api';
import type { Workspace, WorkspaceForm } from '../types';

export const useWorkspaces = () =>
  useSWR<Workspace[]>(
    workspacesKey,
    () => workspacesApi.getAll().then((res) => res.data ?? []),
    {
      fallbackData: [],
    },
  );

export const useCreateWorkspace = () =>
  useSWRMutation(
    workspacesKey,
    (_, { arg }: { arg: WorkspaceForm }) => workspacesApi.create(arg),
    {
      revalidate: false,
      populateCache: (res, currentData: Workspace[] = []) =>
        res.data ? [res.data, ...currentData] : currentData,
    },
  );

export const useUpdateWorkspace = () =>
  useSWRMutation(
    workspacesKey,
    (_, { arg: { id, ...data } }: { arg: { id: string } & WorkspaceForm }) =>
      workspacesApi.update(id, data),
    {
      revalidate: false,
      populateCache: (res, currentData: Workspace[] = []) =>
        currentData.map((workspace) =>
          workspace.id === res.data?.id ? res.data : workspace,
        ),
    },
  );

export const useDeleteWorkspace = () =>
  useSWRMutation(
    workspacesKey,
    (_, { arg: workspaceId }: { arg: Workspace['id'] }) =>
      workspacesApi
        .delete(workspaceId)
        .then((res) => ({ ...res, data: workspaceId })),
    {
      revalidate: false,
      populateCache: (res, currentData: Workspace[] = []) =>
        currentData.filter((workspace) => workspace.id !== res.data),
    },
  );
