import axios, { AxiosError, type AxiosResponse } from 'axios';
import { removeUserSession } from '../../features/auth/helpers';
import { paths, router } from '../../routes';
import { toast } from '../../shared/toast';

export type ApiResponse<T = void> = {
  data?: T;
  message?: string;
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => response,
  (error: AxiosError<ApiResponse>) => {
    if (!error.response) {
      toast.error("Can't connect to server");
      return Promise.reject(error);
    }

    console.error(error);

    switch (error.response.status) {
      case 401:
        removeUserSession();
        toast.error(
          error.response?.data?.message ?? 'You have been logged out!',
        );
        router.navigate(paths.auth.signIn, { replace: true });
        break;
      case 403:
        toast.error('You are not authorized to access this resource');
        break;
    }

    return Promise.reject(error.response.data);
  },
);
