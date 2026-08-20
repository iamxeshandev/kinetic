import axios, { AxiosError } from 'axios';
import { toast } from '../../components/toast';

declare module 'axios' {
  interface AxiosResponse {
    message?: string;
  }
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.response.use(
  (response) => ({
    ...response,
    data: response.data.data,
    message: response.data.message,
  }),
  (error: AxiosError<{ message?: string }>) => {
    let message = error.response?.data?.message;
    if (!message && !error.request.data) message = "Can't connect to server";
    toast.error(message || 'An error occurred');
    return Promise.reject(error);
  },
);
