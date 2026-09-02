import axios, { AxiosError, type AxiosResponse } from 'axios';
import { CONFIG } from '../../config';
import { paths, router } from '../../routes';
import type { ApiResponse } from './types';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => response,
  (error: AxiosError<ApiResponse>) => {
    if (!error.response) {
      return Promise.reject(error);
    }

    console.error(error);

    switch (error.response.status) {
      case 401:
        localStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
        router.navigate(paths.auth.signIn, { replace: true });
        break;
    }

    return Promise.reject(error.response.data);
  },
);
