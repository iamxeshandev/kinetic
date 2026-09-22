import { Box, Button, Typography } from '@mui/material';
import { AddIcon } from '../../../shared/icons';
import { Can } from '../../../shared/permissions';
import { useAuthContext } from '../../auth/context';
import { hasWorkspaceRole } from '../../workspaces/helpers/has-workspace-role';

export type HeaderSectionProps = {
  onCreateClick: () => void;
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

      <Can allowed={hasWorkspaceRole(user?.activeWorkspace?.role, 'Manager')}>
        <Button startIcon={<AddIcon />} onClick={onCreateClick}>
          Create User
        </Button>
      </Can>
    </Box>
  );
};
