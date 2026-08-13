import { Stack } from '@mui/material';
import { DashboardContent } from './DashboardContent';
import { DashboardHeader } from './DashboardHeader';
import { DashboardStat } from './DashboardStat';

export function DashboardView() {
  return (
    <Stack spacing={3}>
      <DashboardHeader />
      <DashboardStat />
      <DashboardContent />
    </Stack>
  );
}
