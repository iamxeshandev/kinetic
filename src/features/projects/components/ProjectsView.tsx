import { Stack } from '@mui/material';
import { useProjects, useUpdateProject } from '../hooks/useProjects';
import type { Project } from '../types/types';
import { AllProjectsSection } from './AllProjectsSection';
import { FavoriteSection } from './FavoriteSection';
import { HeaderSection } from './HeaderSection';

export function ProjectsView() {
  const { data: projects = [] } = useProjects();
  const { trigger: updateProject } = useUpdateProject();

  const handleFavoriteClick = (projectId: Project['id']) => {
    const found = projects.find((p) => p.id === projectId)!;
    const updated = { ...found, isFavorite: !found.isFavorite };
    updateProject(updated).catch(() => {});
  };

  const handleProjectClick = () => {};

  const favoriteProjects = projects.filter((p) => p.isFavorite);

  return (
    <Stack spacing={3} sx={{ flex: 1 }}>
      <HeaderSection />
      <FavoriteSection
        favoriteProjects={favoriteProjects}
        onFavoriteClick={handleFavoriteClick}
        onProjectClick={handleProjectClick}
        actions={[]}
      />
      <AllProjectsSection
        projects={projects}
        onFavoriteClick={handleFavoriteClick}
        onProjectClick={handleProjectClick}
        actions={[]}
      />
    </Stack>
  );
}
