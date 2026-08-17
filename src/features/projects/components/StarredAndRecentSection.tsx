import {
  Avatar,
  AvatarGroup,
  Box,
  capitalize,
  Card,
  CardActionArea,
  IconButton,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { LuTriangleAlert } from 'react-icons/lu';
import { MdCircle, MdStar, MdStarOutline } from 'react-icons/md';
import { Label, type LabelProps } from '../../../components/ui';
import { checkOverdue, formatDate } from '../../../utils/helpers';

const PRIORITY_COLORS: Record<string, string> = {
  high: 'error.main',
  medium: 'warning.main',
  low: 'success.main',
};

const STATUS_COLORS: Record<string, LabelProps['color']> = {
  active: 'info',
  completed: 'success',
};

export function StarredAndRecentSection() {
  const handleStarredClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
  };

  const handleCardClick = () => {};

  return (
    <Box>
      <Typography
        color='textSecondary'
        sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}
      >
        Starred & Recent
      </Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ overflow: 'auto', p: 1 }}
      >
        {projects.map((p) => (
          <Card
            key={p.id}
            sx={{ width: { xs: undefined, sm: 280 }, minWidth: 280 }}
          >
            <CardActionArea
              role='button'
              component={'div'}
              onClick={handleCardClick}
              sx={{ p: 2 }}
            >
              <Stack spacing={1}>
                <Stack
                  direction={'row'}
                  spacing={1}
                  sx={{ alignItems: 'center' }}
                >
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
                    <Box
                      component={LuTriangleAlert}
                      sx={{ color: 'error.main' }}
                    />
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
                    onClick={handleStarredClick}
                  >
                    {p.isStarred ? <MdStar /> : <MdStarOutline />}
                  </IconButton>
                </Stack>

                <Typography variant='body2'>{p.name}</Typography>

                <Stack
                  direction={'row'}
                  spacing={1}
                  sx={{ alignItems: 'center' }}
                >
                  <LinearProgress
                    variant='determinate'
                    value={p.progress}
                    color={
                      p.progress >= 100
                        ? 'success'
                        : p.progress >= 50
                          ? 'info'
                          : p.progress > 0
                            ? 'warning'
                            : 'error'
                    }
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
        ))}
      </Stack>
    </Box>
  );
}

const projects = [
  {
    id: 1,
    name: 'E-Commerce Platform Redesign',
    description:
      'Complete overhaul of the online store with modern UI/UX and improved checkout flow.',
    status: 'active',
    priority: 'high',
    dueDate: '2026-08-15',
    team: ['John Doe', 'Jane Smith', 'Mike Johnson'],
    progress: 75,
    tasks: 24,
    completedTasks: 18,
    isStarred: true,
  },
  {
    id: 2,
    name: 'Mobile App Development',
    description:
      'Native mobile app for iOS and Android with offline capabilities and push notifications.',
    status: 'completed',
    priority: 'medium',
    dueDate: '2026-06-30',
    team: ['Sarah Wilson', 'Tom Brown', 'Emily Davis'],
    progress: 100,
    tasks: 32,
    completedTasks: 32,
    isStarred: true,
  },
  {
    id: 3,
    name: 'AI Chatbot Integration',
    description:
      'Implement AI-powered customer support chatbot with natural language processing.',
    status: 'active',
    priority: 'low',
    dueDate: '2026-10-01',
    team: ['Alex Chen', 'Maria Garcia'],
    progress: 40,
    tasks: 15,
    completedTasks: 6,
    isStarred: false,
  },
];
