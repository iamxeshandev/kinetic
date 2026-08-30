import { createHashRouter } from 'react-router';

export const router = createHashRouter([
  {
    path: '',
    lazy: () => import('../layouts/public'),
    children: [
      { index: true, lazy: () => import('../pages/HomePage') },
      { path: 'about', lazy: () => import('../pages/AboutPage') },
      { path: 'contact', lazy: () => import('../pages/ContactPage') },
    ],
  },
  {
    path: 'auth',
    lazy: () => import('../layouts/auth'),
    children: [
      { path: 'sign-in', lazy: () => import('../pages/SignInPage') },
      { path: 'sign-up', lazy: () => import('../pages/SignUpPage') },
      {
        path: 'reset-password',
        lazy: () => import('../pages/ResetPasswordPage'),
      },
    ],
  },
  {
    path: '',
    lazy: () => import('../layouts/account'),
    children: [
      { path: 'workspaces', lazy: () => import('../pages/WorkspacesPage') },
      { path: 'account', lazy: () => import('../pages/AccountPage') },
    ],
  },
  {
    path: 'workspaces/:workspaceId',
    lazy: () => import('../layouts/workspace'),
    children: [
      { path: 'dashboard', lazy: () => import('../pages/DashboardPage') },
      { path: 'projects', lazy: () => import('../pages/ProjectsPage') },
      { path: 'calendar', lazy: () => import('../pages/CalendarPage') },
      { path: 'users', lazy: () => import('../pages/UsersPage') },
    ],
  },
]);
