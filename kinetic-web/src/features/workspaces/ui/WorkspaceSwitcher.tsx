import {
  CircularProgress,
  Divider,
  InputAdornment,
  ListItemText,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from '@mui/material';
import { LuBuilding } from 'react-icons/lu';
import { useNavigate, useParams } from 'react-router';
import { paths } from '../../../routes';
import { useBoolean } from '../../../shared/hooks';
import { ArrowRightIcon } from '../../../shared/icons';
import { StyledIcon } from '../../../shared/icons/StyledIcon';
import { toast } from '../../../shared/toast';
import { authApi } from '../../auth/api';
import { useAuthContext } from '../../auth/context';
import { useWorkspaces } from '../../workspaces/hooks';

export function WorkspaceSwitcher() {
  const { workspaceId } = useParams();

  const { setUser } = useAuthContext();

  const navigate = useNavigate();

  const isSubmitting = useBoolean();

  const { data: workspaces = [], isLoading } = useWorkspaces();

  const handleChange = (event: SelectChangeEvent) => {
    const workspaceId = event.target.value;

    if (workspaceId === 'view-all') {
      navigate(paths.workspaces.root);
      return;
    }

    isSubmitting.setTrue();

    authApi
      .switch(workspaceId)
      .then((res) => setUser(res.data))
      .catch((err) => toast.error(err.message))
      .finally(() => isSubmitting.setFalse());
  };

  const isValidWorkspace = workspaces.some((w) => w.id === workspaceId);

  return (
    <Select
      size='small'
      value={isLoading || !isValidWorkspace ? '' : workspaceId}
      onChange={handleChange}
      startAdornment={
        <InputAdornment position='start'>
          <LuBuilding />
        </InputAdornment>
      }
      endAdornment={
        isSubmitting.value && (
          <InputAdornment position='end'>
            <CircularProgress size={20} color='inherit' />
          </InputAdornment>
        )
      }
      disabled={isSubmitting.value}
      sx={{
        minWidth: 200,
        display: { xs: 'none', sm: 'flex' },
        backgroundColor: 'surface.subtle',
      }}
    >
      {workspaces.map((workspace) => (
        <MenuItem
          key={workspace.id}
          value={workspace.id}
          onClick={(e) => e.currentTarget.blur()}
        >
          {workspace.name}
        </MenuItem>
      ))}

      <Divider />

      <MenuItem value='view-all' onClick={(e) => e.currentTarget.blur()}>
        <ListItemText>View all</ListItemText>
        <StyledIcon icon={ArrowRightIcon} />
      </MenuItem>
    </Select>
  );
}
