import { LinearProgress } from '@mui/material';
import { useNavigation } from 'react-router';

export function NavigationProgress() {
  const navigation = useNavigation();

  return (
    navigation.state !== 'idle' && (
      <LinearProgress
        sx={{ zIndex: 9999, position: 'fixed', top: 0, width: 1 }}
      />
    )
  );
}
