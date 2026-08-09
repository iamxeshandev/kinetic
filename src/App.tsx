import { CssBaseline, ThemeProvider } from '@mui/material';
import { RouterProvider } from 'react-router';
import { router } from './routes/router';
import { theme } from './theme/theme';

function App() {
  return (
    <ThemeProvider theme={theme} defaultMode='system'>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
