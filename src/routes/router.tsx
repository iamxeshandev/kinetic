import { createHashRouter } from 'react-router';
import { SplashScreen } from '../components/ui/SplashScreen';
import { AuthLayout, MainLayout } from '../layouts';

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
]);
