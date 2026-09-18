import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import {
  createWorkspace,
  deleteWorkspace,
  getWorkspaces,
  updateWorkspace,
  type WorkspaceDto,
  type WorkspaceRequest,
} from '../../../shared/api';

const KEY = 'workspaces';

export const useWorkspaces = () =>
  useSWR<WorkspaceDto[]>(KEY, () =>
    getWorkspaces().then((res) => res.data.data ?? []),
  );

export const useCreateWorkspace = () =>
  useSWRMutation(
    KEY,
    (_, { arg }: { arg: WorkspaceRequest }) =>
      createWorkspace({ body: arg }).then((res) => res.data),
    {
      revalidate: false,
      populateCache: (res, currentData: WorkspaceDto[] = []) =>
        res.data ? [res.data, ...currentData] : currentData,
    },
  );

export const useUpdateWorkspace = (workspaceId: string) =>
  useSWRMutation(
    KEY,
    (_, { arg }: { arg: WorkspaceRequest }) =>
      updateWorkspace({ path: { workspaceId }, body: arg }).then(
        (res) => res.data,
      ),
    {
      revalidate: false,
      populateCache: (res, currentData: WorkspaceDto[] = []) =>
        currentData.map((workspace) =>
          workspace.id === res.data?.id ? res.data : workspace,
        ),
    },
  );

export const useDeleteWorkspace = (workspaceId: string) =>
  useSWRMutation(
    KEY,
    () => deleteWorkspace({ path: { workspaceId } }).then((res) => res.data),
    {
      revalidate: false,
      populateCache: (_, currentData: WorkspaceDto[] = []) =>
        currentData.filter((workspace) => workspace.id !== workspaceId),
    },
  );
