import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot, { type TimelineDotProps } from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import { Card, Link, List, Typography } from '@mui/material';
import { NavLink } from 'react-router';
import { ListHeader } from '../../../components/ui';
import { formatDate } from '../../../utils/helpers';

export function DashboardRecentActivity() {
  return (
    <Card>
      <List
        subheader={<ListHeader title='Recent Activity' divider />}
        disablePadding
      >
        <Timeline
          sx={{
            '& .MuiTimelineItem-root::before': {
              display: 'none',
            },
            '& .MuiTimelineItem-root:last-child .MuiTimelineConnector-root': {
              display: 'none',
            },
          }}
        >
          {RECENT_ACTIVITY.map(({ id, user, action, target, date }) => (
            <TimelineItem key={id}>
              <TimelineSeparator>
                <TimelineDot color={TIMELINE_ACTION_COLORS[action]} />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent variant='body2'>
                <strong>{user.name}</strong> {action}{' '}
                <Link component={NavLink} to={target.url}>
                  {target.title}
                </Link>
                <br />
                <Typography variant='subtitle2'>
                  {formatDate(date, 'short', true)}
                </Typography>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </List>
    </Card>
  );
}

type TimelineAction =
  | 'created'
  | 'updated'
  | 'commented'
  | 'completed'
  | 'deleted';

type TimelineEvent = {
  id: number;
  user: {
    name: string;
    avatar?: string;
  };
  action: TimelineAction;
  target: {
    title: string;
    url: string;
  };
  date: Date;
  meta?: {
    status?: string;
    labels?: string[];
  };
};

const TIMELINE_ACTION_COLORS: Record<
  TimelineAction,
  TimelineDotProps['color']
> = {
  created: 'primary',
  commented: 'secondary',
  updated: 'warning',
  completed: 'success',
  deleted: 'error',
};

const RECENT_ACTIVITY: TimelineEvent[] = [
  {
    id: 1,
    user: {
      name: 'Sarah Johnson',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    action: 'completed',
    target: {
      title: 'Implement user authentication flow',
      url: '',
    },
    date: new Date('2024-01-15T14:30:00'),
    meta: {
      status: 'done',
      labels: ['frontend', 'security'],
    },
  },
  {
    id: 2,
    user: {
      name: 'Mike Chen',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    action: 'updated',
    target: {
      title: 'Fix login page responsiveness',
      url: '',
    },
    date: new Date('2024-01-15T11:15:00'),
    meta: {
      status: 'in-progress',
      labels: ['bug', 'ui'],
    },
  },
  {
    id: 3,
    user: {
      name: 'Emma Wilson',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    action: 'commented',
    target: {
      title: 'Update design system components',
      url: '',
    },
    date: new Date('2024-01-15T09:45:00'),
    meta: {
      labels: ['design', 'ui-kit'],
    },
  },
  {
    id: 4,
    user: {
      name: 'Alex Rivera',
      avatar: 'https://i.pravatar.cc/150?img=4',
    },
    action: 'created',
    target: {
      title: 'API documentation for v2 endpoints',
      url: '',
    },
    date: new Date('2024-01-14T16:20:00'),
    meta: {
      status: 'draft',
      labels: ['documentation', 'api'],
    },
  },
  {
    id: 5,
    user: {
      name: 'Lisa Park',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    action: 'updated',
    target: {
      title: 'Dashboard analytics widget',
      url: '',
    },
    date: new Date('2024-01-14T10:00:00'),
    meta: {
      status: 'review',
      labels: ['analytics', 'frontend'],
    },
  },
];
