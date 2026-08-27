import { api } from '../../../utils/axios';
import { UserSchema, type User } from '../types/auth.types';

const BASE_URL = '/auth';

export const authApi = {
  login: (email: string, password: string, rememberMe: boolean) =>
    api
      .post<User>(`${BASE_URL}/login`, { email, password, rememberMe })
      .then((response) => UserSchema.parse(response.data) && response),

  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) =>
    api.post(`${BASE_URL}/register`, { email, password, firstName, lastName }),

  logout: () => api.post(`${BASE_URL}/logout`),

  me: () =>
    api
      .get<User>(`${BASE_URL}/me`)
      .then((response) => UserSchema.parse(response.data) && response),
};
