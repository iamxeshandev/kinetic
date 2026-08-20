import { SnackbarProvider } from 'notistack';
import { useRef } from 'react';

export function ToastProvider() {
  const ref = useRef<SnackbarProvider>(null);

  const handleDismiss = (key: string | number) => {
    ref.current?.closeSnackbar(key);
  };

  return (
    <SnackbarProvider
      ref={ref}
      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      autoHideDuration={3000}
    />
  );
}
