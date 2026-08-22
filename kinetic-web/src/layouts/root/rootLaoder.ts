import { authApi } from '../../features/auth';

export const rootLoader = () =>
  authApi
    .me()
    .then((response) => response.data)
    .catch(() => null);

export { rootLoader as loader };
