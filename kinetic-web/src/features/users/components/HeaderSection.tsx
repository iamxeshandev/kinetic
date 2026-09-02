import { Box, Button, Typography } from '@mui/material';
import { AddIcon } from '../../../shared/components/icons';
import type { Callback } from '../../../shared/types';
import { WORKSPACE_RANKS } from '../../../shared/types';
import { useAuthContext } from '../../auth/context';

export type HeaderSectionProps = {
  onCreateClick: Callback;
};

export const HeaderSection = ({ onCreateClick }: HeaderSectionProps) => {
  const { user } = useAuthContext();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Box>
        <Typography variant='h1'>Users</Typography>
        <Typography variant='subtitle1'>Manage your users here</Typography>
      </Box>

      {WORKSPACE_RANKS[user?.currentWorkspace?.role ?? 'Member'] > 0 && (
        <Button startIcon={<AddIcon />} onClick={onCreateClick}>
          Create User
        </Button>
      )}
    </Box>
  );
};
