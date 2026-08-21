import {
  Box,
  Button,
  Fab,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useLayoutEffect, useState } from 'react';
import { LuPlus } from 'react-icons/lu';
import { type ActionMenuButtonProps } from '../../../components/ui';

export type ProjectsHeaderProps = {
  statusOptions: ActionMenuButtonProps['actions'];
  status: string;
};

export function HeaderSection() {
  const [bottomOffset, setBottomOffset] = useState(0);

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  useLayoutEffect(() => {
    if (isMobile) {
      const dashboardNavMobileHeight =
        document.getElementById('dashboard-layout-nav-mobile')?.clientHeight ??
        0;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBottomOffset(dashboardNavMobileHeight);
    }
  }, [isMobile]);

  return (
    <Stack
      direction='row'
      spacing={2}
      sx={{ justifyContent: 'space-between', alignItems: 'center' }}
    >
      <Box>
        <Typography variant='h1'>Projects</Typography>
        <Typography variant='subtitle1'>
          Manage and track your team's initiatives.
        </Typography>
      </Box>

      <Button
        startIcon={<LuPlus />}
        sx={{ display: { xs: 'none', sm: 'inherit' } }}
      >
        Create Project
      </Button>

      <Fab
        color='primary'
        sx={{
          display: { xs: 'inherit', sm: 'none' },
          fontSize: '1.5rem',
          position: 'fixed',
          bottom: 16 + bottomOffset,
          right: 16,
          zIndex: (theme) => theme.zIndex.fab,
        }}
      >
        <LuPlus />
      </Fab>
    </Stack>
  );
}
