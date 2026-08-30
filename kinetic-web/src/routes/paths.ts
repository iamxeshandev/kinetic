// * All paths must start with a slash

export const paths = {
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
  workspaces: (workspaceId: string) => ({
    dashboard: `/workspaces/${workspaceId}/dashboard`,
    projects: `/workspaces/${workspaceId}/projects`,
    calendar: `/workspaces/${workspaceId}/calendar`,
    users: `/workspaces/${workspaceId}/users`,
  }),
};
