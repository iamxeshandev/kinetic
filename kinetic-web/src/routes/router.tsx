import { createBrowserRouter } from 'react-router';
import { SplashScreen } from '../shared/ui';

export const router = createBrowserRouter([
  {
    path: '/',
    HydrateFallback: SplashScreen,
    lazy: () => import('./branches/root'),
    children: [
      {
        path: '',
        lazy: () => import('./branches/public'),
        children: [
          { index: true, lazy: () => import('../pages/home') },
          { path: 'about', lazy: () => import('../pages/about') },
          { path: 'contact', lazy: () => import('../pages/contact') },
        ],
      },
      {
        path: 'auth',
        lazy: () => import('./branches/auth'),
        children: [
          { path: 'sign-in', lazy: () => import('../pages/sign-in') },
          { path: 'sign-up', lazy: () => import('../pages/sign-up') },
          {
            path: 'reset-password',
            lazy: () => import('../pages/reset-password'),
          },
        ],
      },
      {
        path: '',
        lazy: () => import('./branches/account'),
        children: [
          { path: 'account', lazy: () => import('../pages/account') },
          { path: 'workspaces', lazy: () => import('../pages/workspaces') },
        ],
      },
      {
        path: 'workspaces/:workspaceId',
        lazy: () => import('./branches/workspace'),
        children: [
          { path: 'dashboard', lazy: () => import('../pages/dashboard') },
          {
            path: 'projects',
            children: [
              { index: true, lazy: () => import('../pages/projects') },
              {
                path: ':projectId',
                lazy: () => import('../pages/project-details'),
              },
            ],
          },
          { path: 'calendar', lazy: () => import('../pages/calendar') },
          { path: 'users', lazy: () => import('../pages/users') },
        ],
      },
      { path: '*', lazy: () => import('../pages/404') },
    ],
  },
]);
