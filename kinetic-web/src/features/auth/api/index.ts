import { api, type ApiResponse } from '../../../shared/api';
import { type LoginResponse } from '../types';

const baseUrl = 'api/auth';

export const authApi = {
  login: (email: string, password: string, rememberMe: boolean) =>
    api
      .post<
        ApiResponse<LoginResponse>
      >(`${baseUrl}/login`, { email, password, rememberMe })
      .then((res) => res.data),

  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) =>
    api
      .post<ApiResponse>(`${baseUrl}/register`, {
        email,
        password,
        firstName,
        lastName,
      })
      .then((res) => res.data),

  logout: () =>
    api.post<ApiResponse>(`${baseUrl}/logout`).then((res) => res.data),

  me: () =>
    api
      .get<ApiResponse<LoginResponse>>(`${baseUrl}/me`)
      .then((res) => res.data),
};
