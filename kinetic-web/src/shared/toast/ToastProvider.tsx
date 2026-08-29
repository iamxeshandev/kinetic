import { SnackbarProvider } from 'notistack';
import { useRef, type PropsWithChildren } from 'react';

export function ToastProvider({ children }: PropsWithChildren) {
  const ref = useRef<SnackbarProvider>(null);

  return (
    <SnackbarProvider
      ref={ref}
      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      autoHideDuration={3000}
    >
      {children}
    </SnackbarProvider>
  );
}
