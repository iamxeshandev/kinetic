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
import {
  LuActivity,
  LuArrowRight,
  LuCalendar,
  LuTriangleAlert,
} from 'react-icons/lu';
import { ActionMenuIconButton, IconLabel } from '../../../components/ui';
import { checkOverdue, formatDate } from '../../../utils/helpers';
import { ProjectHealth } from './ProjectHealth';
import { ProjectProgress } from './ProjectProgress';
import type { Project } from './ProjectsView';

export type ProjectGridProps = {
  projects: Project[];
};

export default function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 2,
        mt: 2,
      }}
    >
      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} />
      ))}
    </Box>
  );
}

// ***************************************************************************
// * ProjectCard
// ***************************************************************************

function ProjectCard({ project }: { project: Project }) {
  const isCompleted = project.status === 'completed';
  const isDelayed = checkOverdue(project.dueDate);

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
          <ActionMenuIconButton actions={[]} />
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
            {!isCompleted && isDelayed && (
              <Box component={LuTriangleAlert} sx={{ color: 'error.main' }} />
            )}
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
              <Avatar
                key={name}
                src={name}
                alt={name}
                sx={{
                  width: '1.5rem',
                  height: '1.5rem',
                  fontSize: '1rem',
                }}
              >
                {name[0]}
              </Avatar>
            ))}
          </AvatarGroup>

          <Button size='small' variant='text' endIcon={<LuArrowRight />}>
            Open Project
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}
