import { useEffect, useState, type PropsWithChildren } from 'react';
import { toast } from '../../../components/toast';
import { SplashScreen } from '../../../components/ui';
import { authApi } from '../api/authApi';
import { setUserSession } from '../helpers/user-session';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authApi
      .me()
      .then((response) => {
        setUserSession(response.data);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <SplashScreen />;

  return <AuthContext.Provider value={null}>{children}</AuthContext.Provider>;
}
