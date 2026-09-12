import { CssBaseline, GlobalStyles, ThemeProvider } from '@mui/material';
import { RouterProvider } from 'react-router';
import { SWRConfig } from 'swr';
import { AuthProvider } from './features/auth/context/AuthProvider';
import { NotificationProvider } from './features/notifications/context';
import { router } from './routes';
import { swrConfig } from './shared/api';
import { IconProvider } from './shared/icons/IconProvider';
import { ToastProvider } from './shared/toast';
import { styles, theme } from './theme';

function App() {
  return (
    <SWRConfig value={swrConfig}>
      <ThemeProvider theme={theme} defaultMode='system'>
        <IconProvider>
          <ToastProvider>
            <AuthProvider>
              <NotificationProvider>
                <CssBaseline />
                <GlobalStyles styles={styles} />
                <RouterProvider router={router} />
              </NotificationProvider>
            </AuthProvider>
          </ToastProvider>
        </IconProvider>
      </ThemeProvider>
    </SWRConfig>
  );
}

export default App;
