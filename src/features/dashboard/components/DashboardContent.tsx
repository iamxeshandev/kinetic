import { Box } from '@mui/material';
import { DashboardPriorityTasks } from './DashboardPriorityTasks';
import { DashboardRecentActivity } from './DashboardRecentActivity';

export function DashboardContent() {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
        gap: 2,
        flex: 1,
      }}
    >
      <DashboardPriorityTasks />
      <DashboardRecentActivity />
    </Box>
  );
}
