import { api } from '../../../utils/axios';

const BASE_URL = '/auth';

export const authApi = {
  login: (email: string, password: string, rememberMe: boolean) =>
    api.post(`${BASE_URL}/login`, { email, password, rememberMe }),

  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) =>
    api.post(`${BASE_URL}/register`, { email, password, firstName, lastName }),

  logout: () => api.post(`${BASE_URL}/logout`),

  me: () => api.get(`${BASE_URL}/me`),
};
