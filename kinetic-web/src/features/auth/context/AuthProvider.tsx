import { useEffect, useState, type PropsWithChildren } from 'react';
import { CONFIG } from '../../../config';
import { getMe, type MeDto } from '../../../shared/api';
import { useLocalStorage } from '../../../shared/hooks';
import { SplashScreen } from '../../../shared/ui';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useLocalStorage<MeDto | null>(
    CONFIG.STORAGE_KEYS.USER,
    null,
  );
  const [isLoading, setIsLoading] = useState(!user);

  useEffect(() => {
    getMe({ throwOnError: true })
      .then((res) => setUser(res.data?.data ?? null))
      .catch(() => setUser(null))
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
