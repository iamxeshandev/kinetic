import type { SWRConfiguration } from 'swr';

export const swrConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  errorRetryCount: 0,
  fallbackData: [],
};
