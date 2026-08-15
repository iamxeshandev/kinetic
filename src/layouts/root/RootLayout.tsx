import { Outlet } from 'react-router';
import { LoadingBar } from './components/LoadingBar';

export function RootLayout() {
  return (
    <>
      <LoadingBar />
      <Outlet />
    </>
  );
}
