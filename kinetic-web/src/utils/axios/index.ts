import axios, { AxiosError } from 'axios';
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
  (response) => ({
    ...response,
    data: response.data.data,
    message: response.data.message,
  }),
  (error: AxiosError<{ message?: string }>) => {
    if (!error.response) toast.error("Can't connect to server");
    if (error.response?.status === 401) {
      removeUserSession();
      toast.error('You have been logged out!');
      router.navigate(paths.auth.signIn, { replace: true });
    }
    return Promise.reject(error);
  },
);
