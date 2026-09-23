import {
  Box,
  Card,
  CardActionArea,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { LuBuilding } from 'react-icons/lu';
import type { WorkspaceDto } from '../../../shared/api';
import { useBoolean } from '../../../shared/hooks';
import { PencilIcon, TrashIcon, UsersIcon } from '../../../shared/icons';
import { Label } from '../../../shared/ui';

export type WorkspaceGridProps = {
  workspaces: WorkspaceDto[];
  onOpenClick?: (workspaceId: string) => void | Promise<void>;
  onEditClick?: (workspaceId: string) => void;
  onDeleteClick?: (workspaceId: string) => void;
};

export function WorkspaceGrid({
  workspaces,
  onOpenClick,
  onEditClick,
  onDeleteClick,
}: WorkspaceGridProps) {
  const isSwitching = useBoolean();

  const onClick = async (workspaceId: string) => {
    isSwitching.setTrue();
    await onOpenClick?.(workspaceId);
    isSwitching.setFalse();
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 3,
      }}
    >
      {workspaces.map((workspace) => (
        <Card key={workspace.id}>
          <CardActionArea
            component={'div'}
            onClick={() => onClick(workspace.id)}
            sx={{ p: 3 }}
            disabled={isSwitching.value}
          >
            <Stack spacing={1}>
              <Stack
                spacing={1}
                direction={'row'}
                sx={{ justifyContent: 'space-between', alignItems: 'center' }}
              >
                <Label sx={{ fontSize: '2rem', p: 1.5 }}>
                  <LuBuilding />
                </Label>

                <Box>
                  <IconButton
                    className='workspace-hover-button'
                    onClick={(event) => {
                      event.stopPropagation();
                      onEditClick?.(workspace?.id);
                    }}
                  >
                    <PencilIcon />
                  </IconButton>

                  {!workspace.isPersonalWorkspace &&
                    workspace.role === 'Owner' && (
                      <IconButton
                        className='workspace-hover-button'
                        color='error'
                        onClick={(event) => {
                          event.stopPropagation();
                          onDeleteClick?.(workspace?.id);
                        }}
                      >
                        <TrashIcon />
                      </IconButton>
                    )}
                </Box>
              </Stack>

              <Stack spacing={0.5}>
                <Typography variant='h5'>{workspace.name}</Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Label chip>
                    {workspace.isPersonalWorkspace
                      ? 'Personal Workspace'
                      : workspace.role}
                  </Label>

                  {!workspace.isPersonalWorkspace && (
                    <Typography
                      variant='subtitle2'
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        fontWeight: 'bold',
                      }}
                    >
                      <UsersIcon />{' '}
                      <span>
                        {workspace.memberCount}{' '}
                        {Number(workspace.memberCount) > 1
                          ? 'Members'
                          : 'Member'}
                      </span>
                    </Typography>
                  )}
                </Box>
              </Stack>
            </Stack>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  );
}
