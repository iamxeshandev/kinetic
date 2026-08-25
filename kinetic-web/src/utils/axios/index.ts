import axios, { AxiosError, type AxiosResponse } from 'axios';
import { toast } from '../../components/toast';
import { removeUserSession } from '../../features/auth/helpers/user-session';
import { paths, router } from '../../routes';

declare module 'axios' {
  interface AxiosResponse {
    message?: string;
  }
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response: AxiosResponse) => {
    response.message = response.data.message;
    response.data = response.data.data;

    return response;
  },
  (error: AxiosError<{ message: string } | undefined>) => {
    if (!error.response) {
      toast.error("Can't connect to server");
      return Promise.reject(error);
    }

    error.response.message =
      error.response.data?.message ?? 'Something went wrong';
    error.response.data = undefined;

    if (error.response.status === 401) {
      removeUserSession();
      toast.error('You have been logged out!');
      router.navigate(paths.auth.signIn, { replace: true });
    }

    return Promise.reject(error);
  },
);
