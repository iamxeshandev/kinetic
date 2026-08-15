import { Stack } from '@mui/material';
import { DashboardContent } from './DashboardContent';
import { DashboardHeader } from './DashboardHeader';
import { DashboardHighlights } from './DashboardHighlights';

export function DashboardView() {
  return (
    <Stack spacing={3} sx={{ flex: 1 }}>
      <DashboardHeader />
      <DashboardHighlights />
      <DashboardContent />
    </Stack>
  );
}
