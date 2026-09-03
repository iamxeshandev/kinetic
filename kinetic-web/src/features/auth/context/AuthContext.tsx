import { createContext, type Dispatch, type SetStateAction } from 'react';
import type { LoginResponse } from '../types';

export type AuthContextValue = {
  user: LoginResponse | undefined;
  setUser: Dispatch<SetStateAction<LoginResponse | undefined>>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
