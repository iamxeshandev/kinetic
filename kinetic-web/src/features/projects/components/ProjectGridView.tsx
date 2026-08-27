import {
  Avatar,
  AvatarGroup,
  Box,
  Card,
  IconButton,
  Typography,
} from '@mui/material';
import { ArrowRightIcon, MoreIcon } from '../../../components/icons';
import type { Project } from '../types/project.types';
import type { AllProjectSectionProps } from './AllProjectsSection';
import { ProjectHealth } from './ProjectHealth';
import { ProjectProgress } from './ProjectProgress';

export default function ProjectGrid({
  projects,
  onOpenProjectClick: onProjectClick,
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
          onOpenProjectClick={onProjectClick}
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
  onOpenProjectClick,
  onMoreClick,
}: {
  project: Project;
  onOpenProjectClick: AllProjectSectionProps['onOpenProjectClick'];
  onMoreClick: AllProjectSectionProps['onMoreClick'];
}) {
  const isCompleted = project.status === 'Completed';

  return (
    <Card key={project.id} sx={{ p: 2 }} aria-label={`Project ${project.name}`}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateRows: 'auto 1fr auto auto',
          gap: 1,
          height: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            noWrap
            sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {project.name}
          </Typography>
          <IconButton
            size='small'
            color='primary'
            onClick={() => onOpenProjectClick(project.id)}
          >
            <ArrowRightIcon />
          </IconButton>
          <IconButton size='small' onClick={(e) => onMoreClick(e, project.id)}>
            <MoreIcon />
          </IconButton>
        </Box>

        <Typography
          variant='subtitle2'
          sx={{
            display: '-webkit-box',
            overflow: 'hidden',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
          }}
        >
          {project.description}
        </Typography>

        <ProjectProgress value={25} max={100} showPercentage />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <ProjectHealth dueDate={project.dueDate} isCompleted={isCompleted} />

          <AvatarGroup max={3}>
            {['A', 'B', 'C', 'D', 'E', 'F'].map((member) => (
              <Avatar key={member}>{member}</Avatar>
            ))}
          </AvatarGroup>
        </Box>
      </Box>
    </Card>
  );
}
