import axios from 'axios';
import { CONFIG } from '../../config';
import { paths, router } from '../../routes';

export const api = axios.create({
  baseURL: import.meta.env.DEV ? 'http://localhost:5197' : '/',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
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
