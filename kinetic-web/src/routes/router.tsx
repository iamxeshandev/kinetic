import { createHashRouter, Outlet } from 'react-router';
import { SplashScreen } from '../shared/components/ui';
import { AuthGuard, GuestGuard } from '../shared/guards';

export const router = createHashRouter([
  {
    path: '',
    HydrateFallback: SplashScreen,
    lazy: () => import('../layouts/root'),
    children: [
      // * Public Routes
      {
        path: '',
        lazy: () => import('../layouts/public'),
        children: [
          { index: true, lazy: () => import('../pages/home') },
          { path: 'about', lazy: () => import('../pages/about') },
          { path: 'contact', lazy: () => import('../pages/contact') },
        ],
      },

      // * Guest Routes
      {
        element: (
          <GuestGuard>
            <Outlet />
          </GuestGuard>
        ),
        children: [
          {
            path: 'auth',
            lazy: () => import('../layouts/auth'),
            children: [
              { path: 'sign-in', lazy: () => import('../pages/sign-in') },
              { path: 'sign-up', lazy: () => import('../pages/sign-up') },
              {
                path: 'reset-password',
                lazy: () => import('../pages/reset-password'),
              },
            ],
          },
        ],
      },

      // * Protected Routes
      {
        element: (
          <AuthGuard>
            <Outlet />
          </AuthGuard>
        ),
        children: [
          {
            path: '',
            lazy: () => import('../layouts/account'),
            children: [
              { path: 'workspaces', lazy: () => import('../pages/workspaces') },
              { path: 'account', lazy: () => import('../pages/account') },
            ],
          },
          {
            path: 'workspaces/:workspaceId',
            lazy: () => import('../layouts/workspace'),
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
        ],
      },

      // * Error Routes
      {
        path: '',
        lazy: () => import('../layouts/error'),
        children: [
          { path: '404', lazy: () => import('../pages/404') },
          { path: '*', lazy: () => import('../pages/404') },
        ],
      },
    ],
  },
]);
