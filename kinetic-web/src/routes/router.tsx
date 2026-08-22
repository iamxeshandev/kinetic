import { createHashRouter } from 'react-router';
import { SplashScreen } from '../components/ui/SplashScreen';

export const router = createHashRouter([
  {
    path: '/',
    lazy: () => import('../layouts/root'),
    HydrateFallback: SplashScreen,
    children: [
      {
        path: '',
        lazy: () => import('../layouts/main'),
        children: [
          { index: true, lazy: () => import('../pages/HomePage') },
          { path: 'about', lazy: () => import('../pages/AboutPage') },
          { path: 'contact', lazy: () => import('../pages/ContactPage') },
        ],
      },
      {
        path: '/auth',
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
        path: '/dashboard',
        lazy: () => import('../layouts/dashboard/DashboardLayout'),
        children: [
          { index: true, lazy: () => import('../pages/DashboardPage') },
          { path: 'projects', lazy: () => import('../pages/ProjectsPage') },
          { path: 'calendar', lazy: () => import('../pages/CalendarPage') },
          { path: 'teams', lazy: () => import('../pages/TeamsPage') },
        ],
      },
    ],
  },
]);
