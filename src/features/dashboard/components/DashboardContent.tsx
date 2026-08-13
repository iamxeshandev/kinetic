import {
  Box,
  Card,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { LuChevronRight } from 'react-icons/lu';
import { ListHeader } from '../../../components/ui';
import { Label } from '../../../components/ui/Label';
import { formatDate } from '../../../utils/helpers/formateDate';
import { priorityTasks } from '../data/priority-tasks';

export function DashboardContent() {
  const handleClick = () => {
    alert('clicked');
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
        gap: 2,
      }}
    >
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
          {priorityTasks.map(
            ({ id, title, priority, dueDate, assignee, status }) => (
              <ListItem key={id} divider>
                <ListItemIcon>
                  <LuChevronRight />
                </ListItemIcon>
                <ListItemText
                  primary={title}
                  secondary={assignee + ' | ' + priority}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Label color='primary' size='small'>
                    {status}
                  </Label>
                  <Typography variant='subtitle1'>
                    {formatDate(dueDate, 'short')}
                  </Typography>
                </Box>
              </ListItem>
            ),
          )}
        </List>
      </Card>
      <Card>
        <List
          subheader={<ListHeader title='Recent Activity' divider />}
          disablePadding
        >
          <ListItem>123</ListItem>
        </List>
      </Card>
    </Box>
  );
}
