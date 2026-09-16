import { api } from '../../../shared/api';
import type { components } from '../../../shared/api/types';
import type { WorkspaceForm } from '../types';

const baseUrl = 'api/workspaces';

export const workspacesApi = {
  getAll: () =>
    api
      .get<components['schemas']['ResponseOfListOfWorkspaceDto']>(baseUrl)
      .then((res) => res.data),

  getById: (workspaceId: string) =>
    api
      .get<components['schemas']['ResponseOfWorkspaceDto']>(
        `${baseUrl}/${workspaceId}`,
      )
      .then((res) => res.data),

  create: (workspace: WorkspaceForm) =>
    api
      .post<components['schemas']['ResponseOfWorkspaceDto']>(baseUrl, workspace)
      .then((res) => res.data),

  update: (workspaceId: string, workspace: WorkspaceForm) =>
    api
      .put<components['schemas']['ResponseOfWorkspaceDto']>(
        `${baseUrl}/${workspaceId}`,
        workspace,
      )
      .then((res) => res.data),

  delete: (workspaceId: string) =>
    api
      .delete<components['schemas']['Response']>(`${baseUrl}/${workspaceId}`)
      .then((res) => res.data),
};

export { baseUrl as workspacesKey };
