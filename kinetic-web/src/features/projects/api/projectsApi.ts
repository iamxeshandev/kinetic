import { api } from '../../../utils/axios';
import type { Project } from '../types/project.types';

const projectsBaseUrl = (workspaceId: string) =>
  `/workspaces/${workspaceId}/projects`;

export const projectsApi = {
  getAll: (workspaceId: string) =>
    api.get<Project[]>(projectsBaseUrl(workspaceId)),
  getById: (workspaceId: string, id: string) =>
    api.get<Project>(`${projectsBaseUrl(workspaceId)}/${id}`),
  create: (workspaceId: string, data: object) =>
    api.post<Project>(projectsBaseUrl(workspaceId), data),
  update: (workspaceId: string, id: string, data: object) =>
    api.put<Project>(`${projectsBaseUrl(workspaceId)}/${id}`, data),
  delete: (workspaceId: string, id: string) =>
    api.delete<null>(`${projectsBaseUrl(workspaceId)}/${id}`),
};

export const projectsKey = projectsBaseUrl;
