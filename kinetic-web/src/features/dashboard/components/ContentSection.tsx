import { Box } from '@mui/material';
import { PriorityTasks } from './PriorityTasks';
import { RecentActivity } from './RecentActivity';

export function ContentSection() {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
        gap: 2,
        flex: 1,
      }}
    >
      <PriorityTasks />
      <RecentActivity />
    </Box>
  );
}
