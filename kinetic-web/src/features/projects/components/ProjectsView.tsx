import { Box, Stack } from '@mui/material';
import { useState } from 'react';
import { useParams } from 'react-router';
import { PencilIcon, TrashIcon } from '../../../components/icons';
import { ActionMenu, type ActionMenuButtonProps } from '../../../components/ui';
import { useProjects, useUpdateProject } from '../hooks/useProjects';
import type { Project } from '../types/project.types';
import { AllProjectsSection } from './AllProjectsSection';
import { FavoriteSection } from './FavoriteSection';
import { HeaderSection } from './HeaderSection';
import { ProjectForm } from './ProjectForm';

export function ProjectsView() {
  const { workspaceId } = useParams();

  const { data: projects = [] } = useProjects(workspaceId!);

  const { trigger: updateProject } = useUpdateProject(workspaceId!);

  const [projectForm, setProjectForm] = useState<boolean>(false);
  const [projectId, setProjectId] = useState<string | null>(null);

  const [menu, setMenu] = useState<{
    anchorEl: HTMLButtonElement | null;
    id: string | null;
  }>({ anchorEl: null, id: null });

  const handleFavoriteClick = (projectId: Project['id']) => {
    const found = projects.find((p) => p.id === projectId)!;
    const updated = { ...found, isFavorite: !found.isFavorite };
    updateProject(updated).catch(() => {});
  };

  const handleProjectClick = () => {};

  const handleMoreClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string,
  ) => setMenu({ anchorEl: event.currentTarget, id });

  const actions: ActionMenuButtonProps['actions'] = [
    {
      icon: <PencilIcon />,
      label: 'Edit',
      onClick: () => {
        setProjectId(menu.id);
        setProjectForm(true);
      },
    },
    {
      icon: <Box component={TrashIcon} sx={{ color: 'error.main' }} />,
      label: 'Delete',
      onClick: () => {},
    },
  ];

  return (
    <Stack spacing={3} sx={{ flex: 1 }}>
      <HeaderSection onCreateClick={() => setProjectForm(true)} />
      <FavoriteSection
        favoriteProjects={projects.filter((p) => p.isFavorite)}
        onFavoriteClick={handleFavoriteClick}
        onProjectClick={handleProjectClick}
        actions={actions}
      />
      <AllProjectsSection
        projects={projects}
        onFavoriteClick={handleFavoriteClick}
        onProjectClick={handleProjectClick}
        onMoreClick={handleMoreClick}
      />

      <ProjectForm
        open={projectForm}
        onClose={() => setProjectForm(false)}
        onExited={() => setProjectId(null)}
        project={projects.find((p) => p.id === projectId)}
      />

      <ActionMenu
        open={!!menu.anchorEl}
        onClose={() => setMenu({ anchorEl: null, id: null })}
        anchorEl={menu.anchorEl}
        actions={actions}
      />
    </Stack>
  );
}
