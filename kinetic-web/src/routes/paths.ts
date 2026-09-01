// * All paths must start with a slash

export const paths = {
  notFound: '/404',
  home: {
    root: '/',
  },
  about: {
    root: '/about',
  },
  contact: {
    root: '/contact',
  },
  auth: {
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
    resetPassword: '/auth/reset-password',
  },
  workspaces: {
    root: '/workspaces',
    detail: (workspaceId: string) => `/workspaces/${workspaceId}`,
    dashboard: (workspaceId: string) => `/workspaces/${workspaceId}/dashboard`,
    projects: (workspaceId: string) => `/workspaces/${workspaceId}/projects`,
    calendar: (workspaceId: string) => `/workspaces/${workspaceId}/calendar`,
    users: (workspaceId: string) => `/workspaces/${workspaceId}/users`,
    settings: (workspaceId: string, section: string = 'general') =>
      `/workspaces/${workspaceId}/settings?tab=${section}`,
  },
} as const;
