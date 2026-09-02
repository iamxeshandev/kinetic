import { api, type ApiResponse } from '../../../shared/api';
import type { User, UserForm } from '../types';

const baseUrl = (workspaceId: string) => `api/workspaces/${workspaceId}/users`;

export const usersApi = {
  getAll: (workspaceId: string) =>
    api.get<ApiResponse<User[]>>(baseUrl(workspaceId)).then((res) => res.data),

  getById: (workspaceId: string, userId: string) =>
    api
      .get<ApiResponse<User>>(`${baseUrl(workspaceId)}/${userId}`)
      .then((res) => res.data),

  create: (workspaceId: string, user: UserForm) =>
    api
      .post<ApiResponse<User>>(baseUrl(workspaceId), user)
      .then((res) => res.data),

  update: (workspaceId: string, userId: string, user: UserForm) =>
    api
      .put<ApiResponse<User>>(`${baseUrl(workspaceId)}/${userId}`, user)
      .then((res) => res.data),

  delete: (workspaceId: string, userId: string) =>
    api
      .delete<ApiResponse<User>>(`${baseUrl(workspaceId)}/${userId}`)
      .then((res) => res.data),
};

export { baseUrl as usersKey };
