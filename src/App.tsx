import { CssBaseline, GlobalStyles, ThemeProvider } from '@mui/material';
import { RouterProvider } from 'react-router';
import { router } from './routes/router';
import { styles } from './theme/styles';
import { theme } from './theme/theme';

function App() {
  return (
    <ThemeProvider theme={theme} defaultMode='system'>
      <CssBaseline />
      <GlobalStyles styles={styles} />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
