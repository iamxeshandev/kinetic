import {
  Avatar,
  AvatarGroup,
  Box,
  Card,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { LuArrowRight } from 'react-icons/lu';
import {
  ActionMenuIconButton,
  type ActionMenuIconButtonProps,
} from '../../../components/ui';
import { FavoriteIconButton } from '../../../components/ui/FavoriteIconButton';
import { formatDate } from '../../../utils/helpers';
import type { Project } from '../types/types';
import { ProjectHealth } from './ProjectHealth';
import { ProjectProgress } from './ProjectProgress';

export type FavoriteSectionProps = {
  favoriteProjects: Project[];
  onFavoriteClick: (projectId: Project['id']) => void;
  onProjectClick: (projectId: Project['id']) => void;
  actions: ActionMenuIconButtonProps['actions'];
};

export function FavoriteSection({
  favoriteProjects,
  onFavoriteClick,
  onProjectClick,
  actions,
}: FavoriteSectionProps) {
  if (favoriteProjects.length === 0) return null;
  return (
    <Box>
      <Typography variant='overline1'>Favorites</Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 2,
          mt: 1,
        }}
      >
        {favoriteProjects.slice(0, 4).map((p) => (
          <ProjectCard
            key={p.id}
            project={p}
            onProjectClick={onProjectClick}
            onFavoriteClick={onFavoriteClick}
            actions={actions}
          />
        ))}
      </Box>
    </Box>
  );
}

// ***************************************************************************
// * ProjectCard
// ***************************************************************************

function ProjectCard({
  project,
  onProjectClick,
  onFavoriteClick,
  actions,
}: {
  project: Project;
  onProjectClick: (projectId: Project['id']) => void;
  onFavoriteClick: (projectId: Project['id']) => void;
  actions: ActionMenuIconButtonProps['actions'];
}) {
  const isCompleted = project.completedTasks === project.tasks;

  return (
    <Card key={project.id} sx={{ p: 2 }}>
      <Stack spacing={1}>
        <Stack direction={'row'} spacing={0.5} sx={{ alignItems: 'center' }}>
          <ProjectHealth
            dueDate={project.dueDate}
            isCompleted={isCompleted}
            variant='label'
          />

          <Typography
            variant='subtitle2'
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textWrap: 'nowrap',
              flex: 1,
            }}
          >
            {formatDate(project.dueDate, 'relative')}
          </Typography>

          <Stack direction={'row'} sx={{ alignItems: 'center' }}>
            <FavoriteIconButton
              isFavorite={project.isFavorite}
              onClick={() => onFavoriteClick(project.id)}
            />

            <IconButton
              size='small'
              color='primary'
              onClick={() => onProjectClick(project.id)}
            >
              <LuArrowRight />
            </IconButton>

            <ActionMenuIconButton actions={actions} />
          </Stack>
        </Stack>

        <Typography variant='body2'>{project.name}</Typography>

        <Stack direction={'row'} spacing={2} sx={{ alignItems: 'center' }}>
          <ProjectProgress
            value={project.completedTasks}
            max={project.tasks}
            sx={{ flex: 1 }}
          />

          <AvatarGroup max={3}>
            {project.team.map((name) => (
              <Avatar key={name} size='small'>
                {name[0]}
              </Avatar>
            ))}
          </AvatarGroup>
        </Stack>
      </Stack>
    </Card>
  );
}
