import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { LuActivity, LuArrowRight, LuCalendar } from 'react-icons/lu';
import {
  ActionMenuIconButton,
  IconLabel,
  type ActionMenuIconButtonProps,
} from '../../../components/ui';
import { FavoriteIconButton } from '../../../components/ui/FavoriteIconButton';
import { formatDate } from '../../../utils/helpers';
import type { Project } from '../types/project.types';
import { ProjectHealth } from './ProjectHealth';
import { ProjectProgress } from './ProjectProgress';

export type ProjectGridProps = {
  projects: Project[];
  onFavoriteClick: (projectId: Project['id']) => void;
  onProjectClick: (projectId: Project['id']) => void;
  actions: ActionMenuIconButtonProps['actions'];
};

export default function ProjectGrid({
  projects,
  onFavoriteClick,
  onProjectClick,
  actions,
}: ProjectGridProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 2,
      }}
    >
      {projects.map((p) => (
        <ProjectCard
          key={p.id}
          project={p}
          onFavoriteClick={onFavoriteClick}
          onProjectClick={onProjectClick}
          actions={actions}
        />
      ))}
    </Box>
  );
}

// ***************************************************************************
// * ProjectCard
// ***************************************************************************

function ProjectCard({
  project,
  onFavoriteClick,
  onProjectClick,
  actions,
}: {
  project: Project;
  onFavoriteClick: (projectId: Project['id']) => void;
  onProjectClick: (projectId: Project['id']) => void;
  actions: ActionMenuIconButtonProps['actions'];
}) {
  const isCompleted = project.completedTasks === project.tasks;

  return (
    <Card key={project.id} sx={{ p: 2 }}>
      <Stack spacing={{ xs: 1, sm: 2 }}>
        <Stack direction={'row'} spacing={1} sx={{ alignItems: 'center' }}>
          <IconLabel sx={{}}>
            <LuActivity />
          </IconLabel>
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <Typography noWrap variant='body2'>
              {project.name}
            </Typography>
            <Typography noWrap variant='subtitle2'>
              {project.description}
            </Typography>
          </Box>
          <FavoriteIconButton
            isFavorite={project.isFavorite}
            onClick={() => onFavoriteClick(project.id)}
          />
          <ActionMenuIconButton actions={actions} />
        </Stack>
        <Stack
          direction={'row'}
          spacing={1}
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <ProjectHealth dueDate={project.dueDate} isCompleted={isCompleted} />
          <Typography
            variant='subtitle2'
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            {<LuCalendar />}
            {formatDate(project.dueDate)}
          </Typography>
        </Stack>

        <ProjectProgress
          value={project.completedTasks}
          max={project.tasks}
          showPercentage
        />

        <Divider />

        <Stack
          direction={'row'}
          spacing={2}
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <AvatarGroup max={3}>
            {project.team.map((name) => (
              <Avatar key={name} size='small'>
                {name[0]}
              </Avatar>
            ))}
          </AvatarGroup>

          <Button
            size='small'
            variant='text'
            endIcon={<LuArrowRight />}
            onClick={() => onProjectClick(project.id)}
          >
            Open Project
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}
