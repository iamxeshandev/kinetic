import { type PropsWithChildren } from 'react';
import { NotificationContext } from './NotificationContext';

export function NotificationProvider({ children }: PropsWithChildren) {
  return (
    <NotificationContext.Provider value={null}>
      {children}
    </NotificationContext.Provider>
  );
}
