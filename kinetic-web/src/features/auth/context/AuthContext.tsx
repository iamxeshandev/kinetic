import { createContext, type Dispatch, type SetStateAction } from 'react';
import type { User } from '../types/auth.types';

export type AuthContextValue = {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
