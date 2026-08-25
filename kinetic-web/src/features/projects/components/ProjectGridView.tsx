import {
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { LuActivity, LuArrowRight, LuCalendar } from 'react-icons/lu';
import { MoreIcon } from '../../../components/icons';
import { IconLabel } from '../../../components/ui';
import { FavoriteIconButton } from '../../../components/ui/FavoriteIconButton';
import type { Project } from '../types/project.types';
import type { AllProjectSectionProps } from './AllProjectsSection';

export default function ProjectGrid({
  projects,
  onFavoriteClick,
  onProjectClick,
  onMoreClick,
}: AllProjectSectionProps) {
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
          onMoreClick={onMoreClick}
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
  onMoreClick,
}: {
  project: Project;
  onFavoriteClick: AllProjectSectionProps['onFavoriteClick'];
  onProjectClick: AllProjectSectionProps['onProjectClick'];
  onMoreClick: AllProjectSectionProps['onMoreClick'];
}) {
  // const isCompleted = project.completedTasks === project.tasks;

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
          <IconButton
            size='small'
            onClick={(event) => onMoreClick(event, project.id)}
          >
            <MoreIcon />
          </IconButton>
        </Stack>
        <Stack
          direction={'row'}
          spacing={1}
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* <ProjectHealth dueDate={project.dueDate} isCompleted={isCompleted} /> */}
          <Typography
            variant='subtitle2'
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            {<LuCalendar />}
            {/* {formatDate(project.dueDate)} */}
          </Typography>
        </Stack>

        {/* <ProjectProgress
          value={project.completedTasks}
          max={project.tasks}
          showPercentage
        /> */}

        <Divider />

        <Stack
          direction={'row'}
          spacing={2}
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* <AvatarGroup max={3}>
            {project.team.map((name) => (
              <Avatar key={name} size='small'>
                {name[0]}
              </Avatar>
            ))}
          </AvatarGroup> */}

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
