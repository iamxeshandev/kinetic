import {
  CircularProgress,
  Divider,
  InputAdornment,
  ListItemText,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from '@mui/material';
import { useNavigate } from 'react-router';
import { paths } from '../../../routes';
import { ArrowRightIcon } from '../../../shared/components/icons';
import { StyledIcon } from '../../../shared/components/icons/StyledIcon';
import { useBoolean } from '../../../shared/hooks';
import { useAuthContext } from '../../auth/context';
import { workspacesApi } from '../api';
import { useWorkspaces } from '../hooks';

export function WorkspaceSwitcher() {
  const { user, setUser } = useAuthContext();

  const navigate = useNavigate();

  const loading = useBoolean();

  const { data: workspaces = [], isValidating } = useWorkspaces();

  const handleChange = (event: SelectChangeEvent) => {
    const workspaceId = event.target.value;

    if (workspaceId === 'view-all') {
      navigate(paths.workspaces.root);
      return;
    }

    loading.setTrue();
    workspacesApi
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
      .finally(() => loading.setFalse());
  };

  const currentId = user?.currentWorkspace?.id ?? '';
  const hasValidWorkspace = workspaces.some((w) => w.id === currentId);

  return (
    <Select
      size='small'
      sx={{ width: 320, display: { xs: 'none', sm: 'block' } }}
      value={isValidating || !hasValidWorkspace ? '' : currentId}
      onChange={handleChange}
      endAdornment={
        loading.value && (
          <InputAdornment position='end'>
            <CircularProgress size={20} color='inherit' />
          </InputAdornment>
        )
      }
      disabled={loading.value}
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
