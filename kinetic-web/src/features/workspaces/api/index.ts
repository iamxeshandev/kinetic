import { api, type ApiResponse } from '../../../shared/api';
import type { LoginResponse } from '../../auth/types';
import type { Workspace, WorkspaceForm } from '../types';

const baseUrl = 'api/workspaces';

export const workspacesApi = {
  getAll: () =>
    api.get<ApiResponse<Workspace[]>>(baseUrl).then((res) => res.data),

  getById: (workspaceId: string) =>
    api
      .get<ApiResponse<Workspace>>(`${baseUrl}/${workspaceId}`)
      .then((res) => res.data),

  create: (workspace: WorkspaceForm) =>
    api
      .post<ApiResponse<Workspace>>(baseUrl, workspace)
      .then((res) => res.data),

  update: (workspaceId: string, workspace: WorkspaceForm) =>
    api
      .put<ApiResponse<Workspace>>(`${baseUrl}/${workspaceId}`, workspace)
      .then((res) => res.data),

  delete: (workspaceId: string) =>
    api
      .delete<ApiResponse>(`${baseUrl}/${workspaceId}`)
      .then((res) => res.data),

  switch: (workspaceId: string) =>
    api
      .put<ApiResponse<LoginResponse>>(`${baseUrl}/${workspaceId}/switch`)
      .then((res) => res.data),
};

export { baseUrl as workspacesKey };
