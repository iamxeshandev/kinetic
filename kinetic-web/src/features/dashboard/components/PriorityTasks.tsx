import {
  Box,
  Card,
  Link,
  List,
  ListItem,
  ListItemText,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { LuTriangleAlert } from 'react-icons/lu';
import { Label, ListHeader } from '../../../components/ui';
import { checkOverdue, formatDate } from '../../../utils/helpers';

export function PriorityTasks() {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const handleClick = () => {};

  return (
    <Card>
      <List
        subheader={
          <ListHeader
            title='Priority Tasks'
            divider
            action={<Link onClick={handleClick}>View All</Link>}
          />
        }
        disablePadding
      >
        {PRIORITY_TASKS.map(
          ({ id, title, priority, dueDate, assignee, status }) => (
            <ListItem key={id} divider dense={isMobile}>
              <ListItemText
                primary={title}
                secondary={
                  <Typography variant='subtitle2'>
                    {assignee + ' | ' + priority} |{' '}
                    <Label
                      color='primary'
                      size='small'
                      sx={{ display: 'inline' }}
                    >
                      {status}
                    </Label>
                  </Typography>
                }
              />
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 1 }}
              >
                {checkOverdue(dueDate) && (
                  <Box
                    component={LuTriangleAlert}
                    sx={{ color: 'error.main' }}
                  />
                )}
                <Typography variant='subtitle2' sx={{ textWrap: 'nowrap' }}>
                  {formatDate(dueDate, 'relative')}
                </Typography>
              </Box>
            </ListItem>
          ),
        )}
      </List>
    </Card>
  );
}

const PRIORITY_TASKS = [
  {
    id: 1,
    title: 'Fix critical security vulnerability',
    priority: 'High',
    dueDate: '2026-08-14',
    assignee: 'Sarah Chen',
    status: 'In Progress',
  },
  {
    id: 2,
    title: 'Complete user onboarding flow',
    priority: 'Medium',
    dueDate: '2026-08-18',
    assignee: 'Mike Johnson',
    status: 'Todo',
  },
  {
    id: 3,
    title: 'Update payment processing',
    priority: 'Low',
    dueDate: '2026-08-13',
    assignee: 'Emily Davis',
    status: 'Review',
  },
  {
    id: 4,
    title: 'Fix mobile responsiveness issues',
    priority: 'High',
    dueDate: '2026-08-16',
    assignee: 'Tom Lee',
    status: 'In Progress',
  },
  {
    id: 5,
    title: 'Database migration',
    priority: 'Medium',
    dueDate: '2026-08-22',
    assignee: 'Alex Rivera',
    status: 'Todo',
  },
];
