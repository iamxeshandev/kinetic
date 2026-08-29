import { api, type ApiResponse } from '../../../utils/axios';
import type { Project, ProjectForm } from '../types';

const baseUrl = (workspaceId: string) =>
  `api/workspaces/${workspaceId}/projects`;

export const projectsApi = {
  getAll: (workspaceId: string) =>
    api
      .get<ApiResponse<Project[]>>(baseUrl(workspaceId))
      .then((res) => res.data),

  getById: (workspaceId: string, id: Project['id']) =>
    api
      .get<ApiResponse<Project>>(`${baseUrl(workspaceId)}/${id}`)
      .then((res) => res.data),

  create: (workspaceId: string, data: ProjectForm) =>
    api
      .post<ApiResponse<Project>>(`${baseUrl(workspaceId)}`, data)
      .then((res) => res.data),

  update: (workspaceId: string, id: Project['id'], data: ProjectForm) =>
    api
      .put<ApiResponse<Project>>(`${baseUrl(workspaceId)}/${id}`, data)
      .then((res) => res.data),

  delete: (workspaceId: string, id: Project['id']) =>
    api
      .delete<ApiResponse>(`${baseUrl(workspaceId)}/${id}`)
      .then((res) => res.data),
};

export const projectsKey = baseUrl;
