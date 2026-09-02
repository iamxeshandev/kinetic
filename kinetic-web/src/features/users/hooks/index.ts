import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { usersApi, usersKey } from '../api';
import type { User, UserForm } from '../types';

export const useUsers = (workspaceId: string) =>
  useSWR<User[]>(
    usersKey(workspaceId),
    () =>
      usersApi.getAll(workspaceId).then((res) => (res.data ? res.data : [])),
    {
      fallbackData: [],
    },
  );

export const useCreateUser = (workspaceId: string) =>
  useSWRMutation(
    usersKey(workspaceId),
    (_, { arg }: { arg: UserForm }) => usersApi.create(workspaceId, arg),
    {
      revalidate: false,
      populateCache: (res, currentData: User[] = []) =>
        res.data ? [res.data, ...currentData] : currentData,
    },
  );

export const useUpdateUser = (workspaceId: string) =>
  useSWRMutation(
    usersKey(workspaceId),
    (_, { arg: { id, ...data } }: { arg: { id: string } & UserForm }) =>
      usersApi.update(workspaceId, id, data),
    {
      revalidate: false,
      populateCache: (res, currentData: User[] = []) =>
        currentData.map((user) => (user.id === res.data?.id ? res.data : user)),
    },
  );

export const useDeleteUser = (workspaceId: string) =>
  useSWRMutation(
    usersKey(workspaceId),
    (_, { arg: userId }: { arg: User['id'] }) =>
      usersApi
        .delete(workspaceId, userId)
        .then((res) => ({ ...res, data: userId })),
    {
      revalidate: false,
      populateCache: (res, currentData: User[] = []) =>
        currentData.filter((user) => user.id !== res.data),
    },
  );
