import { CssBaseline, GlobalStyles, ThemeProvider } from '@mui/material';
import { RouterProvider } from 'react-router';
import { SWRConfig } from 'swr';
import { ToastProvider } from './components/toast';
import { AuthProvider } from './features/auth/context/AuthProvider';
import { NotificationProvider } from './features/notifications';
import { router } from './routes';
import { styles, theme } from './theme';
import { swrConfig } from './utils/swr';

function App() {
  return (
    <SWRConfig value={swrConfig}>
      <ThemeProvider theme={theme} defaultMode='system'>
        <ToastProvider>
          <AuthProvider>
            <NotificationProvider>
              <CssBaseline />
              <GlobalStyles styles={styles} />
              <RouterProvider router={router} />
            </NotificationProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </SWRConfig>
  );
}

export default App;
