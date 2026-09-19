import { Outlet } from 'react-router';
import { PublicLayout } from '../../layouts/public';

export function Component() {
  return (
    <PublicLayout>
      <Outlet />
    </PublicLayout>
  );
}
