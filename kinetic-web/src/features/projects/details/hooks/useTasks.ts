import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import {
  createSubtask,
  createTask,
  deleteSubtask,
  deleteTask,
  getTasks,
  updateSubtask,
  updateTask,
  uploadTaskAttachment,
  type IFormFile,
  type SubtaskRequest,
  type TaskDto,
  type TaskRequest,
} from '../../../../shared/api';

const KEY = (workspaceId: string, projectId: string) =>
  `workspaces/${workspaceId}/projects/${projectId}/tasks`;

export const useTasks = (workspaceId: string, projectId: string) =>
  useSWR<TaskDto[]>(KEY(workspaceId, projectId), () =>
    getTasks({ path: { workspaceId, projectId } }).then(
      (res) => res.data.data ?? [],
    ),
  );

export const useCreateTask = (workspaceId: string, projectId: string) =>
  useSWRMutation(
    KEY(workspaceId, projectId),
    (_, { arg }: { arg: TaskRequest }) =>
      createTask({ path: { workspaceId, projectId }, body: arg }).then(
        (res) => res.data,
      ),
    {
      revalidate: false,
      populateCache: (res, currentData: TaskDto[] = []) =>
        res.data ? [res.data, ...currentData] : currentData,
    },
  );

export const useUpdateTask = (
  workspaceId: string,
  projectId: string,
  taskId: string,
) =>
  useSWRMutation(
    KEY(workspaceId, projectId),
    (_, { arg }: { arg: TaskRequest }) =>
      updateTask({ path: { workspaceId, projectId, taskId }, body: arg }).then(
        (res) => res.data,
      ),
    {
      revalidate: false,
      populateCache: (res, currentData: TaskDto[] = []) =>
        currentData.map((task) => (task.id === res.data?.id ? res.data : task)),
    },
  );

export const useDeleteTask = (
  workspaceId: string,
  projectId: string,
  taskId: string,
) =>
  useSWRMutation(
    KEY(workspaceId, projectId),
    () =>
      deleteTask({ path: { workspaceId, projectId, taskId } }).then(
        (res) => res.data,
      ),
    {
      revalidate: false,
      populateCache: (_, currentData: TaskDto[] = []) =>
        currentData.filter((task) => task.id !== taskId),
    },
  );

export const useCreateSubtask = (
  workspaceId: string,
  projectId: string,
  taskId: string,
) =>
  useSWRMutation(
    KEY(workspaceId, projectId),
    (_, { arg }: { arg: SubtaskRequest }) =>
      createSubtask({
        path: { workspaceId, projectId, taskId },
        body: arg,
      }).then((res) => res.data),
    {
      revalidate: false,
      populateCache: (res, currentData: TaskDto[] = []) =>
        currentData.map((task) =>
          task.id === taskId
            ? {
                ...task,
                subtasks: res.data
                  ? [res.data, ...(task.subtasks ?? [])]
                  : task.subtasks,
              }
            : task,
        ),
    },
  );

export const useUpdateSubtask = (
  workspaceId: string,
  projectId: string,
  taskId: string,
) =>
  useSWRMutation(
    KEY(workspaceId, projectId),
    (
      _,
      {
        arg: { subtaskId, ...payload },
      }: { arg: { subtaskId: string } & SubtaskRequest },
    ) =>
      updateSubtask({
        path: { workspaceId, projectId, taskId, subtaskId },
        body: payload,
      }).then((res) => res.data),
    {
      revalidate: false,
      populateCache: (res, currentData: TaskDto[] = []) =>
        currentData.map((task) =>
          task.id === taskId
            ? {
                ...task,
                subtasks:
                  task.subtasks?.map((subtask) =>
                    subtask.id === res.data?.id ? res.data : subtask,
                  ) ?? null,
              }
            : task,
        ),
    },
  );

export const useDeleteSubtask = (
  workspaceId: string,
  projectId: string,
  taskId: string,
) =>
  useSWRMutation(
    KEY(workspaceId, projectId),
    (_, { arg: { subtaskId } }: { arg: { subtaskId: string } }) =>
      deleteSubtask({
        path: { workspaceId, projectId, taskId, subtaskId },
      }).then((res) => ({ ...res.data, data: subtaskId })),
    {
      revalidate: false,
      populateCache: (res, currentData: TaskDto[] = []) =>
        currentData.map((task) =>
          task.id === taskId
            ? {
                ...task,
                subtasks:
                  task.subtasks?.filter((subtask) => subtask.id !== res.data) ??
                  null,
              }
            : task,
        ),
    },
  );

export const useUploadTaskAttachment = (
  workspaceId: string,
  projectId: string,
  taskId: string,
) =>
  useSWRMutation(
    KEY(workspaceId, projectId),
    (_, { arg }: { arg: IFormFile }) =>
      uploadTaskAttachment({
        path: { workspaceId, projectId, taskId },
        body: {
          File: arg,
        },
      }).then((res) => res.data),
    {
      revalidate: false,
      populateCache: (res, currentData: TaskDto[] = []) =>
        currentData.map((task) =>
          task.id === taskId
            ? {
                ...task,
                attachments: res.data
                  ? [...(task.attachments ?? []), res.data]
                  : task.attachments,
              }
            : task,
        ),
    },
  );
