import type { User } from '../types/auth.types';

const KEY = 'user';

export function getUserSession(): User | null {
  const json = sessionStorage.getItem(KEY);
  return json ? JSON.parse(json) : null;
}

export function setUserSession(user: User) {
  sessionStorage.setItem(KEY, JSON.stringify(user));
}

export function removeUserSession() {
  sessionStorage.removeItem(KEY);
}

export function checkUserSession(): boolean {
  return !!getUserSession();
}
