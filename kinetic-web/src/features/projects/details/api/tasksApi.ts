import { api, type ApiResponse } from '../../../../shared/api';
import type { Task } from '../types';

const baseUrl = (workspaceId: string, projectId: string) =>
  `api/workspaces/${workspaceId}/projects/${projectId}/tasks`;

export const tasksApi = {
  getAll: (workspaceId: string, projectId: string) =>
    api
      .get<ApiResponse<Task[]>>(baseUrl(workspaceId, projectId))
      .then((res) => res.data),

  getById: (workspaceId: string, projectId: string, taskId: string) =>
    api
      .get<ApiResponse<Task>>(`${baseUrl(workspaceId, projectId)}/${taskId}`)
      .then((res) => res.data),

  create: (workspaceId: string, projectId: string, data: Omit<Task, 'id'>) =>
    api
      .post<ApiResponse<Task>>(`${baseUrl(workspaceId, projectId)}`, data)
      .then((res) => res.data),

  update: (
    workspaceId: string,
    projectId: string,
    taskId: string,
    data: Omit<Task, 'id'>,
  ) =>
    api
      .put<
        ApiResponse<Task>
      >(`${baseUrl(workspaceId, projectId)}/${taskId}`, data)
      .then((res) => res.data),

  move: (
    workspaceId: string,
    projectId: string,
    taskId: string,
    data: { sectionId: string; previousTaskId?: string; nextTaskId?: string },
  ) =>
    api
      .patch<ApiResponse>(
        `${baseUrl(workspaceId, projectId)}/${taskId}/move`,
        data,
      )
      .then((res) => res.data),

  delete: (workspaceId: string, projectId: string, taskId: string) =>
    api
      .delete<ApiResponse>(`${baseUrl(workspaceId, projectId)}/${taskId}`)
      .then((res) => res.data),
};

export { baseUrl as tasksKey };
