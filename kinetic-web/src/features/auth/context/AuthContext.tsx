import { createContext, type Dispatch, type SetStateAction } from 'react';
import type { Me } from '../types';

export type AuthContextValue = {
  user: Me | undefined;
  setUser: Dispatch<SetStateAction<Me | undefined>>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
