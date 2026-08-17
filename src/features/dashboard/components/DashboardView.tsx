import { Stack } from '@mui/material';
import { ContentSection } from './ContentSection';
import { HeaderSection } from './HeaderSection';
import { OverviewSection } from './OverviewSection';

export function DashboardView() {
  return (
    <Stack spacing={3} sx={{ flex: 1 }}>
      <HeaderSection />
      <OverviewSection />
      <ContentSection />
    </Stack>
  );
}
