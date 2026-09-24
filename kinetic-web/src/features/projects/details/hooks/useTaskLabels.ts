import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import {
  createTaskLabel,
  deleteTaskLabel,
  getTaskLabels,
  updateTaskLabel,
  type TaskLabelDto,
  type TaskLabelRequest,
} from '../../../../shared/api';

const KEY = (workspaceId: string, projectId: string) =>
  `workspaces/${workspaceId}/projects/${projectId}/task-labels`;

export const useTaskLabels = (workspaceId: string, projectId: string) =>
  useSWR<TaskLabelDto[]>(KEY(workspaceId, projectId), () =>
    getTaskLabels({ path: { workspaceId, projectId } }).then(
      (res) => res.data.data ?? [],
    ),
  );

export const useCreateTaskLabel = (workspaceId: string, projectId: string) =>
  useSWRMutation(
    KEY(workspaceId, projectId),
    (_, { arg }: { arg: TaskLabelRequest }) =>
      createTaskLabel({
        path: { workspaceId, projectId },
        body: arg,
      }).then((res) => res.data),
    {
      revalidate: false,
      populateCache: (res, currentData: TaskLabelDto[] = []) =>
        res.data ? [...currentData, res.data] : currentData,
    },
  );

export const useUpdateTaskLabel = (workspaceId: string, projectId: string) =>
  useSWRMutation(
    KEY(workspaceId, projectId),
    (
      _,
      {
        arg: { taskTypeId, ...payload },
      }: { arg: { taskTypeId: string } & TaskLabelRequest },
    ) =>
      updateTaskLabel({
        path: { workspaceId, projectId, taskTypeId },
        body: payload,
      }).then((res) => res.data),
    {
      revalidate: false,
      populateCache: (res, currentData: TaskLabelDto[] = []) =>
        currentData.map((taskType) =>
          taskType.id === res.data?.id ? res.data : taskType,
        ),
    },
  );

export const useDeleteTaskLabel = (workspaceId: string, projectId: string) =>
  useSWRMutation(
    KEY(workspaceId, projectId),
    (_, { arg: taskTypeId }: { arg: string }) =>
      deleteTaskLabel({ path: { workspaceId, projectId, taskTypeId } }).then(
        (res) => ({ ...res.data, taskTypeId }),
      ),
    {
      revalidate: false,
      populateCache: (res, currentData: TaskLabelDto[] = []) =>
        currentData.filter((taskType) => taskType.id !== res.taskTypeId),
    },
  );
