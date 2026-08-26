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
  (error: AxiosError<{ message?: string; title?: string } | undefined>) => {
    if (!error.response) {
      toast.error("Can't connect to server");
      return Promise.reject(error);
    }

    console.error(error);

    error.response.message =
      error.response.data?.message ??
      error.response.data?.title ??
      'Something went wrong';

    if (error.response.status === 401) {
      removeUserSession();
      toast.error('You have been logged out!');
      router.navigate(paths.auth.signIn, { replace: true });
    }
    if (error.response.status === 403) {
      toast.error('You are not authorized to access this resource');
    }

    return Promise.reject(error);
  },
);
