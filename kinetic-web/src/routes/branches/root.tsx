import { Outlet } from 'react-router';
import { RootLayout } from '../../layouts/root';

export function Component() {
  return (
    <RootLayout>
      <Outlet />
    </RootLayout>
  );
}
