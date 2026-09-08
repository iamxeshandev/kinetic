import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { tasksApi, tasksKey } from '../api';
import type { Task } from '../types';

export const useTasks = (workspaceId: string, projectId: string) =>
  useSWR<Task[]>(
    tasksKey(workspaceId, projectId),
    () => tasksApi.getAll(workspaceId, projectId).then((res) => res.data ?? []),
    {
      fallbackData: [],
    },
  );

export const useCreateTask = (workspaceId: string, projectId: string) =>
  useSWRMutation(
    tasksKey(workspaceId, projectId),
    (_, { arg }: { arg: Omit<Task, 'id'> }) =>
      tasksApi.create(workspaceId, projectId, arg),
    {
      revalidate: false,
      populateCache: (res, currentData: Task[] = []) =>
        res.data ? [res.data, ...currentData] : currentData,
    },
  );

export const useUpdateTask = (workspaceId: string, projectId: string) =>
  useSWRMutation(
    tasksKey(workspaceId, projectId),
    (_, { arg: { id, ...data } }: { arg: Task }) =>
      tasksApi.update(workspaceId, projectId, id, data),
    {
      revalidate: false,
      populateCache: (res, currentData: Task[] = []) =>
        currentData.map((task) => (task.id === res.data?.id ? res.data : task)),
    },
  );

export const useDeleteTask = (workspaceId: string, projectId: string) =>
  useSWRMutation(
    tasksKey(workspaceId, projectId),
    (_, { arg: taskId }: { arg: Task['id'] }) =>
      tasksApi
        .delete(workspaceId, projectId, taskId)
        .then((res) => ({ ...res, data: taskId })),
    {
      revalidate: false,
      populateCache: (res, currentData: Task[] = []) =>
        currentData.filter((task) => task.id !== res.data),
    },
  );
