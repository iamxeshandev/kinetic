import { Box, LinearProgress } from '@mui/material';
import { useNavigation } from 'react-router';

export function LoadingBar() {
  const navigation = useNavigation();

  const isLoading = navigation.state === 'loading';

  if (!isLoading) return null;
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        width: 1,
        zIndex: 9999,
      }}
    >
      <LinearProgress />
    </Box>
  );
}
