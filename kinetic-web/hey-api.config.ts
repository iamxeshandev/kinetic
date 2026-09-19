import type { CreateClientConfig } from './src/shared/api/client.gen';

export const createClientConfig: CreateClientConfig = (config) => ({
  ...config,
  credentials: 'include',
});
