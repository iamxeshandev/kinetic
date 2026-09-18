import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
  type UserDto,
  type UserRequest,
} from '../../../shared/api';

const KEY = (workspaceId: string) => `api/workspaces/${workspaceId}/users`;

export const useUsers = (workspaceId: string) =>
  useSWR<UserDto[]>(KEY(workspaceId), () =>
    getUsers({ path: { workspaceId } }).then((res) => res.data.data ?? []),
  );

export const useCreateUser = (workspaceId: string) =>
  useSWRMutation(
    KEY(workspaceId),
    (_, { arg }: { arg: UserRequest }) =>
      createUser({ path: { workspaceId }, body: arg }).then((res) => res.data),
    {
      revalidate: false,
      populateCache: (res, currentData: UserDto[] = []) =>
        res.data ? [res.data, ...currentData] : currentData,
    },
  );

export const useUpdateUser = (workspaceId: string, userId: string) =>
  useSWRMutation(
    KEY(workspaceId),
    (_, { arg }: { arg: UserRequest }) =>
      updateUser({ path: { workspaceId, userId }, body: arg }).then(
        (res) => res.data,
      ),
    {
      revalidate: false,
      populateCache: (res, currentData: UserDto[] = []) =>
        currentData.map((user) => (user.id === res.data?.id ? res.data : user)),
    },
  );

export const useDeleteUser = (workspaceId: string, userId: string) =>
  useSWRMutation(
    KEY(workspaceId),
    () => deleteUser({ path: { workspaceId, userId } }).then((res) => res.data),
    {
      revalidate: false,
      populateCache: (_, currentData: UserDto[] = []) =>
        currentData.filter((user) => user.id !== userId),
    },
  );
