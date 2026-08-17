import { Stack } from '@mui/material';
import { AllProjectsSection } from './AllProjectsSection';
import { HeaderSection } from './HeaderSection';
import { StarredAndRecentSection } from './StarredAndRecentSection';

export type ProjectStatus = 'all' | 'active' | 'completed';

export function ProjectsView() {
  return (
    <Stack spacing={3}>
      <HeaderSection />
      <StarredAndRecentSection />
      <AllProjectsSection />
    </Stack>
  );
}
