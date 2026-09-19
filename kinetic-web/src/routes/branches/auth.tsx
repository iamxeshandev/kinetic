import { Outlet } from 'react-router';
import { AuthLayout } from '../../layouts/auth';
import { GuestGuard } from '../guards';

export function Component() {
  return (
    <GuestGuard>
      <AuthLayout>
        <Outlet />
      </AuthLayout>
    </GuestGuard>
  );
}
