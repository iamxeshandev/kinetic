import { Stack } from '@mui/material';
import type { Project } from '../../types';
import { HeaderSection } from './HeaderSection';
import { MainSection } from './MainSection';

export type ProjectDetailsViewProps = {
  project: Project;
};

export function ProjectDetailsView({ project }: ProjectDetailsViewProps) {
  return (
    <Stack spacing={3} sx={{ flex: 1 }}>
      {/* Header */}
      <HeaderSection project={project} />

      {/* Tabs */}
      <MainSection />
    </Stack>
  );
}
