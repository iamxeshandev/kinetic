import {
  Avatar,
  AvatarGroup,
  Box,
  capitalize,
  Card,
  CardActionArea,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import type React from 'react';
import type { MouseEventHandler } from 'react';
import { LuTriangleAlert } from 'react-icons/lu';
import { MdCircle, MdStar, MdStarOutline } from 'react-icons/md';
import { Label, type LabelProps } from '../../../components/ui';
import { checkOverdue, formatDate } from '../../../utils/helpers';
import { ProjectProgress } from './ProjectProgress';
import type { Project } from './ProjectsView';

export type StarredAndRecentSectionProps = {
  projects: Project[];
};

export function StarredAndRecentSection({
  projects,
}: StarredAndRecentSectionProps) {
  const handleFavoriteClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
  };

  const handleCardClick = () => {};

  return (
    <Box>
      <Typography variant='overline1'>Starred & Recent</Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 2,
          mt: 1,
        }}
      >
        {projects.slice(0, 4).map((p) => (
          <ProjectCard
            key={p.id}
            p={p}
            onCardClick={handleCardClick}
            onFavoriteClick={handleFavoriteClick}
          />
        ))}
      </Box>
    </Box>
  );
}

// ***************************************************************************
// * ProjectCard
// ***************************************************************************

const PRIORITY_COLORS: Record<string, string> = {
  high: 'error.main',
  medium: 'warning.main',
  low: 'success.main',
};

const STATUS_COLORS: Record<string, LabelProps['color']> = {
  active: 'info',
  completed: 'success',
};

function ProjectCard({
  p,
  onCardClick,
  onFavoriteClick,
}: {
  p: Project;
  onCardClick: MouseEventHandler;
  onFavoriteClick: MouseEventHandler;
}) {
  return (
    <Card key={p.id}>
      <CardActionArea
        role='button'
        component={'div'}
        onClick={onCardClick}
        sx={{ p: 2 }}
      >
        <Stack spacing={1}>
          <Stack direction={'row'} spacing={1} sx={{ alignItems: 'center' }}>
            <Box
              component={MdCircle}
              sx={{
                color: PRIORITY_COLORS[p.priority],
              }}
            />
            <Label size='small' color={STATUS_COLORS[p.status]}>
              {capitalize(p.status)}
            </Label>
            {p.status === 'active' && checkOverdue(p.dueDate) && (
              <Box component={LuTriangleAlert} sx={{ color: 'error.main' }} />
            )}
            <Typography
              variant='subtitle2'
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textWrap: 'nowrap',
                flex: 1,
              }}
            >
              {formatDate(p.dueDate, 'relative')}
            </Typography>
            <IconButton
              size='small'
              color={p.isStarred ? 'warning' : undefined}
              onClick={onFavoriteClick}
            >
              {p.isStarred ? <MdStar /> : <MdStarOutline />}
            </IconButton>
          </Stack>

          <Typography variant='body2'>{p.name}</Typography>

          <Stack direction={'row'} spacing={2} sx={{ alignItems: 'center' }}>
            <ProjectProgress
              value={p.completedTasks}
              max={p.tasks}
              sx={{ flex: 1 }}
            />

            <AvatarGroup max={3}>
              {p.team.map((name) => (
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
          </Stack>
        </Stack>
      </CardActionArea>
    </Card>
  );
}
