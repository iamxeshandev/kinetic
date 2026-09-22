export const CONFIG = {
  APP_NAME: 'Kinetic',
  APP_DESCRIPTION:
    'The all-in-one workspace for modern teams to plan, track, and collaborate in real-time.',

  APP_URL: import.meta.env.VITE_BASE_URL,
  API_URL: import.meta.env.VITE_API_BASE_URL,

  STORAGE_KEYS: {
    USER: 'user',
  },
} as const;
