import { Box, Button, Stack } from '@mui/material';
import { useState } from 'react';
import { useParams } from 'react-router';
import { PencilIcon, TrashIcon } from '../../../components/icons';
import { toast } from '../../../components/toast';
import { ActionMenu, type ActionMenuButtonProps } from '../../../components/ui';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import {
  useDeleteProject,
  useProjects,
  useUpdateProject,
} from '../hooks/useProjects';
import type { Project } from '../types/project.types';
import { AllProjectsSection } from './AllProjectsSection';
import { FavoriteSection } from './FavoriteSection';
import { HeaderSection } from './HeaderSection';
import { ProjectForm } from './ProjectForm';

export function ProjectsView() {
  const { workspaceId } = useParams();

  const { data: projects = [] } = useProjects(workspaceId!);

  const { trigger: updateProject } = useUpdateProject(workspaceId!);
  const { trigger: deleteProject, isMutating: isDeleting } = useDeleteProject(
    workspaceId!,
  );

  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState<boolean>(false);
  const [confirmDialog, setConfirmDialog] = useState<boolean>(false);

  const [menu, setMenu] = useState<{
    anchorEl: HTMLButtonElement | null;
    id: string | null;
  }>({ anchorEl: null, id: null });

  const handleFavoriteClick = (projectId: Project['id']) => {
    const found = projects.find((p) => p.id === projectId);
    if (!found) return;
    const updated = { ...found, isFavorite: !found.isFavorite };
    updateProject(updated)
      .then((res) => toast.success(res.message))
      .catch((err) => toast.error(err.response?.message));
  };

  const handleOpenProjectClick = () => {};

  const handleMoreClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string,
  ) => setMenu({ anchorEl: event.currentTarget, id });

  const handleDeleteProject = () =>
    deleteProject(projectId!)
      .then((res) => {
        toast.success(res.message);
        setProjectId(null);
        setConfirmDialog(false);
      })
      .catch((err) => toast.error(err.response?.message));

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
      onClick: () => {
        setProjectId(menu.id);
        setConfirmDialog(true);
      },
    },
  ];

  return (
    <Stack spacing={3} sx={{ flex: 1 }}>
      <HeaderSection onCreateClick={() => setProjectForm(true)} />
      <FavoriteSection
        favoriteProjects={projects.filter((p) => p.isFavorite)}
        onFavoriteClick={handleFavoriteClick}
        onProjectClick={handleOpenProjectClick}
        actions={actions}
      />
      <AllProjectsSection
        projects={projects}
        onFavoriteClick={handleFavoriteClick}
        onOpenProjectClick={handleOpenProjectClick}
        onMoreClick={handleMoreClick}
      />

      <ProjectForm
        open={projectForm}
        onClose={() => setProjectForm(false)}
        onExited={() => setProjectId(null)}
        project={projects.find((p) => p.id === projectId)}
      />

      <ConfirmDialog
        open={confirmDialog}
        onClose={() => setConfirmDialog(false)}
        title={'Delete Project'}
        subtitle={'Are you sure you want to delete this project?'}
        action={
          <Button
            color='error'
            onClick={handleDeleteProject}
            loading={isDeleting}
          >
            Delete
          </Button>
        }
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
