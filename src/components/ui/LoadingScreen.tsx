import { Box, LinearProgress } from '@mui/material';

export function LoadingScreen() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        minHeight: 1,
      }}
    >
      <LinearProgress color='inherit' sx={{ width: 0.5, maxWidth: 600 }} />
    </Box>
  );
}
