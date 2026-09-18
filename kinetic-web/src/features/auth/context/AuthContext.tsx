import { createContext, type Dispatch, type SetStateAction } from 'react';
import type { MeDto } from '../../../shared/api';

export type AuthContextValue = {
  user: MeDto | null;
  setUser: Dispatch<SetStateAction<MeDto | null>>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
