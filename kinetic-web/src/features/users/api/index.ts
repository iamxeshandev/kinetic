import { api, type ApiResponse } from '../../../utils/axios';
import type { User } from '../types';

const baseUrl = (workspaceId: string) => `api/workspaces/${workspaceId}/users`;

export const usersApi = {
  getAll: (workspaceId: string) =>
    api.get<ApiResponse<User[]>>(baseUrl(workspaceId)).then((res) => res.data),
};
