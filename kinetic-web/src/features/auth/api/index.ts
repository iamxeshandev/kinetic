import { api } from '../../../shared/api';
import type { components } from '../../../shared/api/types';
import type { Workspace } from '../../workspaces/types/workspace';

const baseUrl = 'api/auth';

export const authApi = {
  login: (email: string, password: string, rememberMe: boolean) =>
    api
      .post<components['schemas']['ResponseOfMeDto']>(`${baseUrl}/login`, {
        email,
        password,
        rememberMe,
      })
      .then((res) => res.data),

  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) =>
    api
      .post<components['schemas']['Response']>(`${baseUrl}/register`, {
        email,
        password,
        firstName,
        lastName,
      })
      .then((res) => res.data),

  logout: () =>
    api
      .post<components['schemas']['Response']>(`${baseUrl}/logout`)
      .then((res) => res.data),

  switch: (workspaceId: Workspace['id']) =>
    api
      .patch<components['schemas']['ResponseOfMeDto']>(
        `${baseUrl}/switch/${workspaceId}`,
      )
      .then((res) => res.data),

  me: () =>
    api
      .get<components['schemas']['ResponseOfMeDto']>(`${baseUrl}/me`)
      .then((res) => res.data),
};
