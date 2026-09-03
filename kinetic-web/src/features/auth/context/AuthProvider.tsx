import { useEffect, useState, type PropsWithChildren } from 'react';
import { CONFIG } from '../../../config';
import { SplashScreen } from '../../../shared/components/ui';
import { useLocalStorage } from '../../../shared/hooks';
import { toast } from '../../../shared/toast';
import { authApi } from '../api';
import type { LoginResponse } from '../types';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useLocalStorage<LoginResponse | undefined>(
    CONFIG.STORAGE_KEYS.USER,
    undefined,
  );
  const [isLoading, setIsLoading] = useState(!user);

  useEffect(() => {
    authApi
      .me()
      .then((res) => setUser(res.data))
      .catch((err) => toast.error(err.message))
      .finally(() => setIsLoading(false));
  }, [setUser]);

  const value = {
    user,
    setUser,
    isLoading,
  };

  return isLoading ? (
    <SplashScreen />
  ) : (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
