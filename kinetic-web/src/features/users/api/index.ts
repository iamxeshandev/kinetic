import { api } from '../../../shared/api';
import type { components } from '../../../shared/api/types';
import type { UserForm } from '../types';

const baseUrl = (workspaceId: string) => `api/workspaces/${workspaceId}/users`;

export const usersApi = {
  getAll: (workspaceId: string) =>
    api
      .get<components['schemas']['ResponseOfListOfUserDto']>(
        baseUrl(workspaceId),
      )
      .then((res) => res.data),

  getById: (workspaceId: string, userId: string) =>
    api
      .get<components['schemas']['ResponseOfUserDto']>(
        `${baseUrl(workspaceId)}/${userId}`,
      )
      .then((res) => res.data),

  create: (workspaceId: string, user: UserForm) =>
    api
      .post<components['schemas']['ResponseOfUserDto']>(
        baseUrl(workspaceId),
        user,
      )
      .then((res) => res.data),

  update: (workspaceId: string, userId: string, user: UserForm) =>
    api
      .put<components['schemas']['ResponseOfUserDto']>(
        `${baseUrl(workspaceId)}/${userId}`,
        user,
      )
      .then((res) => res.data),

  delete: (workspaceId: string, userId: string) =>
    api
      .delete<components['schemas']['Response']>(
        `${baseUrl(workspaceId)}/${userId}`,
      )
      .then((res) => res.data),
};

export { baseUrl as usersKey };
