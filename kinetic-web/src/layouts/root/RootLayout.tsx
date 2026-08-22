import { useEffect } from 'react';
import { Outlet, useLoaderData } from 'react-router';
import { useAuthContext } from '../../features/auth/context/useAuthContext';
import { LoadingBar } from './components/LoadingBar';

export function RootLayout() {
  const data = useLoaderData();
  const { setUser } = useAuthContext();

  useEffect(() => {
    if (data) setUser(data);
  }, [data, setUser]);

  return (
    <>
      <LoadingBar />
      <Outlet />
    </>
  );
}

export { RootLayout as Component };
