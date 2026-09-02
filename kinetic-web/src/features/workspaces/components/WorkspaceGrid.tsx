import {
  Box,
  Card,
  CardActionArea,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { LuBuilding } from 'react-icons/lu';
import {
  ArrowRightIcon,
  PencilIcon,
  TrashIcon,
  UsersIcon,
} from '../../../shared/components/icons';
import { StyledIcon } from '../../../shared/components/icons/StyledIcon';
import { Label } from '../../../shared/components/ui';
import type { Callback } from '../../../shared/types';
import type { Workspace } from '../types';

export type WorkspaceGridProps = {
  workspaces: Workspace[];
  onOpenClick?: Callback<[Workspace['id']], void>;
  onEditClick?: Callback<[Workspace['id']], void>;
  onDeleteClick?: Callback<[Workspace['id']], void>;
};

export function WorkspaceGrid({
  workspaces,
  onOpenClick,
  onEditClick,
  onDeleteClick,
}: WorkspaceGridProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 3,
      }}
    >
      {workspaces.map((workspace) => (
        <Card
          key={workspace.id}
          sx={{
            '& .workspace-hover-button': {
              opacity: 0,
              transform: 'translateX(4px)',
              transition: 'opacity 0.2s ease, transform 0.2s ease',
            },
            '&:hover .workspace-hover-button': {
              opacity: 1,
              transform: 'translateX(0)',
            },
          }}
        >
          <CardActionArea
            component={'div'}
            onClick={() => onOpenClick?.(workspace.id)}
            sx={{ p: 3 }}
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

                  {!workspace.isPersonal && workspace.role === 'Owner' && (
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
                    {workspace.isPersonal
                      ? 'Personal Workspace'
                      : workspace.role}
                  </Label>

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
                      {workspace.members}{' '}
                      {workspace.members > 1 ? 'Members' : 'Member'}
                    </span>
                  </Typography>
                </Box>
              </Stack>

              <Divider />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 1,
                  width: 1,
                }}
              >
                <Typography variant='subtitle1'>Last Active</Typography>

                <StyledIcon icon={ArrowRightIcon} />
              </Box>
            </Stack>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  );
}
