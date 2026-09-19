import { Outlet } from 'react-router';
import { AccountLayout } from '../../layouts/account';
import { AuthGuard } from '../guards';

export function Component() {
  return (
    <AuthGuard>
      <AccountLayout>
        <Outlet />
      </AccountLayout>
    </AuthGuard>
  );
}
