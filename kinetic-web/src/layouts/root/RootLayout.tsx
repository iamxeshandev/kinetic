import type { PropsWithChildren } from 'react';
import { NavigationProgress } from './components/NavigationProgress';

export function RootLayout({ children }: PropsWithChildren) {
  return (
    <>
      <NavigationProgress />
      {children}
    </>
  );
}
