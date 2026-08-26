import { Box, Button, Fab, Typography } from '@mui/material';
import { LuPlus } from 'react-icons/lu';
import { getUserSession } from '../../auth/helpers/user-session';

export function HeaderSection() {
  const user = getUserSession();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
      <Box>
        <Typography variant='h1'>Welcome back, {user?.firstName}</Typography>
        <Typography variant='subtitle1'>
          Here's what's happening across your projects today.
        </Typography>
      </Box>

      <Box
        sx={{
          display: { xs: 'none', sm: 'flex' },
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Button startIcon={<LuPlus />}>Create Task</Button>
      </Box>

      <Fab
        color='primary'
        size='large'
        sx={{
          display: { xs: 'inherit', sm: 'none' },
          position: 'fixed',
          bottom: 64,
          right: 12,
        }}
      >
        <LuPlus fontSize={'1.5rem'} />
      </Fab>
    </Box>
  );
}
