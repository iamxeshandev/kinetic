import { Box, LinearProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigation } from 'react-router';

export function LoadingBar() {
  const navigation = useNavigation();

  const [progress, setProgress] = useState(0);

  const isLoading = navigation.state === 'loading';

  useEffect(() => {
    if (!isLoading) return;

    const timer = setInterval(() => {
      setProgress((prev) => (prev === 80 ? prev : prev + 10));
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, [isLoading]);

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
      <LinearProgress variant='determinate' value={progress} />
    </Box>
  );
}
