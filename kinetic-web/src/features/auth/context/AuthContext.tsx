import { createContext, type Dispatch, type SetStateAction } from 'react';

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type AuthContextValue = {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
