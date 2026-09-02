import { api, type ApiResponse } from '../../../shared/api';
import type { Project } from '../types';

export const projectsUrl = (workspaceId: string) =>
  `api/workspaces/${workspaceId}/projects`;

export const projectUrl = (workspaceId: string, id: Project['id']) =>
  `api/workspaces/${workspaceId}/projects/${id}`;

export const projectsApi = {
  getAll: (workspaceId: string) =>
    api
      .get<ApiResponse<Project[]>>(projectsUrl(workspaceId))
      .then((res) => res.data),

  getById: (workspaceId: string, id: Project['id']) =>
    api
      .get<ApiResponse<Project>>(projectUrl(workspaceId, id))
      .then((res) => res.data),

  create: (workspaceId: string, data: Omit<Project, 'id'>) =>
    api
      .post<ApiResponse<Project>>(`${projectsUrl(workspaceId)}`, data)
      .then((res) => res.data),

  update: (workspaceId: string, id: Project['id'], data: Omit<Project, 'id'>) =>
    api
      .put<ApiResponse<Project>>(projectUrl(workspaceId, id), data)
      .then((res) => res.data),

  delete: (workspaceId: string, id: Project['id']) =>
    api
      .delete<ApiResponse>(projectUrl(workspaceId, id))
      .then((res) => res.data),
};
