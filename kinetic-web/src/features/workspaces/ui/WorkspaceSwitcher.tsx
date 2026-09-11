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
import { useNavigate } from 'react-router';
import { paths } from '../../../routes';
import { ArrowRightIcon } from '../../../shared/components/icons';
import { StyledIcon } from '../../../shared/components/icons/StyledIcon';
import { useBoolean } from '../../../shared/hooks';
import { authApi } from '../../auth/api';
import { useAuthContext } from '../../auth/context';
import { useWorkspaces } from '../../workspaces/hooks';

export function WorkspaceSwitcher() {
  const { user, setUser } = useAuthContext();

  const navigate = useNavigate();

  const isSubmitting = useBoolean();

  const { data: workspaces = [], isValidating } = useWorkspaces();

  const handleChange = (event: SelectChangeEvent) => {
    const workspaceId = event.target.value;

    if (workspaceId === 'view-all') {
      navigate(paths.workspaces.root);
      return;
    }

    isSubmitting.setTrue();

    authApi
      .switch(workspaceId)
      .then((res) => {
        if (!res.data) return;
        setUser((prev) =>
          prev
            ? {
                ...prev,
                currentWorkspace: res.data?.currentWorkspace,
              }
            : undefined,
        );
        if (res.data?.currentWorkspace) {
          navigate(paths.workspaces.dashboard(res.data.currentWorkspace.id), {
            replace: true,
          });
        }
      })
      .finally(() => isSubmitting.setFalse());
  };

  const currentId = user?.currentWorkspace?.id ?? '';
  const hasValidWorkspace = workspaces.some((w) => w.id === currentId);

  return (
    <Select
      size='small'
      value={isValidating || !hasValidWorkspace ? '' : currentId}
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
