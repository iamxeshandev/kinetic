import { CssBaseline, GlobalStyles, ThemeProvider } from '@mui/material';
import { RouterProvider } from 'react-router';
import { SWRConfig } from 'swr';
import { AuthProvider } from './features/auth/context/AuthProvider';
import { styles } from './mui/styles';
import { theme } from './mui/theme';
import { router } from './routes';
import { IconProvider } from './shared/icons/IconProvider';
import { ToastProvider } from './shared/toast';

function App() {
  return (
    <SWRConfig value={{ revalidateOnFocus: false }}>
      <ThemeProvider theme={theme} defaultMode='system'>
        <IconProvider>
          <ToastProvider>
            <AuthProvider>
              <CssBaseline />
              <GlobalStyles styles={styles} />
              <RouterProvider router={router} />
            </AuthProvider>
          </ToastProvider>
        </IconProvider>
      </ThemeProvider>
    </SWRConfig>
  );
}

export default App;
