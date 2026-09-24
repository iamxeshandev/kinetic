import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import {
  createTaskType,
  deleteTaskType,
  getTaskTypes,
  updateTaskType,
  type TaskTypeDto,
  type TaskTypeRequest,
} from '../../../../shared/api';

const KEY = (workspaceId: string, projectId: string) =>
  `workspaces/${workspaceId}/projects/${projectId}/task-types`;

export const useTaskTypes = (workspaceId: string, projectId: string) =>
  useSWR<TaskTypeDto[]>(KEY(workspaceId, projectId), () =>
    getTaskTypes({ path: { workspaceId, projectId } }).then(
      (res) => res.data.data ?? [],
    ),
  );

export const useCreateTaskType = (workspaceId: string, projectId: string) =>
  useSWRMutation(
    KEY(workspaceId, projectId),
    (_, { arg }: { arg: TaskTypeRequest }) =>
      createTaskType({ path: { workspaceId, projectId }, body: arg }).then(
        (res) => res.data,
      ),
    {
      revalidate: false,
      populateCache: (res, currentData: TaskTypeDto[] = []) =>
        res.data ? [...currentData, res.data] : currentData,
    },
  );

export const useUpdateTaskType = (workspaceId: string, projectId: string) =>
  useSWRMutation(
    KEY(workspaceId, projectId),
    (
      _,
      {
        arg: { taskTypeId, ...payload },
      }: { arg: { taskTypeId: string } & TaskTypeRequest },
    ) =>
      updateTaskType({
        path: { workspaceId, projectId, taskTypeId },
        body: payload,
      }).then((res) => res.data),
    {
      revalidate: false,
      populateCache: (res, currentData: TaskTypeDto[] = []) =>
        currentData.map((taskType) =>
          taskType.id === res.data?.id ? res.data : taskType,
        ),
    },
  );

export const useDeleteTaskType = (workspaceId: string, projectId: string) =>
  useSWRMutation(
    KEY(workspaceId, projectId),
    (_, { arg: taskTypeId }: { arg: string }) =>
      deleteTaskType({ path: { workspaceId, projectId, taskTypeId } }).then(
        (res) => ({ ...res.data, taskTypeId }),
      ),
    {
      revalidate: false,
      populateCache: (res, currentData: TaskTypeDto[] = []) =>
        currentData.filter((taskType) => taskType.id !== res.taskTypeId),
    },
  );
