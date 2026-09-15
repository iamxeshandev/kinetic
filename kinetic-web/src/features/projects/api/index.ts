import { api, type ApiResponse } from '../../../shared/api';
import type { Project } from '../types';

const baseUrl = (workspaceId: string) =>
  `api/workspaces/${workspaceId}/projects`;

export const projectsApi = {
  getAll: (workspaceId: string) =>
    api
      .get<ApiResponse<Project[]>>(baseUrl(workspaceId))
      .then((res) => res.data),

  getById: (workspaceId: string, projectId: Project['id']) =>
    api
      .get<ApiResponse<Project>>(`${baseUrl(workspaceId)}/${projectId}`)
      .then((res) => res.data),

  create: (workspaceId: string, data: Omit<Project, 'id'>) =>
    api
      .post<ApiResponse<Project>>(`${baseUrl(workspaceId)}`, data)
      .then((res) => res.data),

  update: (
    workspaceId: string,
    projectId: Project['id'],
    data: Omit<Project, 'id'>,
  ) =>
    api
      .put<ApiResponse<Project>>(`${baseUrl(workspaceId)}/${projectId}`, data)
      .then((res) => res.data),

  delete: (workspaceId: string, projectId: Project['id']) =>
    api
      .delete<ApiResponse>(`${baseUrl(workspaceId)}/${projectId}`)
      .then((res) => res.data),

  getProjectMembers: (workspaceId: string, projectId: Project['id']) =>
    api
      .get<
        ApiResponse<Project['team']>
      >(`${`${baseUrl(workspaceId)}/${projectId}`}/members`)
      .then((res) => res.data),
};

export { baseUrl as projectsKey };
