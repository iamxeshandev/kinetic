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
    dashboard: (workspaceId: string) => `/workspaces/${workspaceId}/dashboard`,
    projects: {
      root: (workspaceId: string) => `/workspaces/${workspaceId}/projects`,
      details: (workspaceId: string, projectId: string) =>
        `/workspaces/${workspaceId}/projects/${projectId}`,
    },
    calendar: (workspaceId: string) => `/workspaces/${workspaceId}/calendar`,
    users: (workspaceId: string) => `/workspaces/${workspaceId}/users`,
    settings: (workspaceId: string, section: string = 'general') =>
      `/workspaces/${workspaceId}/settings?tab=${section}`,
  },
} as const;
