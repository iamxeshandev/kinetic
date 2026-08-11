import { createHashRouter } from 'react-router';
import { SplashScreen } from '../components/ui/SplashScreen';
import { AuthLayout, DashboardLayout, MainLayout } from '../layouts';

import { redirect, type MiddlewareFunction } from 'react-router';
import { paths } from './paths';

const requireAuth: MiddlewareFunction = async (_, next) => {
  if (!localStorage.getItem('token')) {
    throw redirect(paths.auth.signIn);
  }
  return await next();
};

export const router = createHashRouter([
  {
    path: '/',
    Component: MainLayout,
    HydrateFallback: SplashScreen,
    children: [
      { index: true, lazy: () => import('../pages/HomePage') },
      { path: 'about', lazy: () => import('../pages/AboutPage') },
      { path: 'contact', lazy: () => import('../pages/ContactPage') },
    ],
  },
  {
    path: '/auth',
    Component: AuthLayout,
    HydrateFallback: SplashScreen,
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
    middleware: [requireAuth],
    Component: DashboardLayout,
    HydrateFallback: SplashScreen,
    children: [
      { index: true, lazy: () => import('../pages/DashboardPage') },
      { path: 'projects', lazy: () => import('../pages/ProjectsPage') },
      { path: 'calendar', lazy: () => import('../pages/CalendarPage') },
      { path: 'teams', lazy: () => import('../pages/TeamsPage') },
    ],
  },
]);
