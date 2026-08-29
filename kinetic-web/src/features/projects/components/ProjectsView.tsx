import { Box, Button, Stack } from '@mui/material';
import { useState } from 'react';
import { useParams } from 'react-router';
import {
  PencilIcon,
  StarIcon,
  StarOffIcon,
  TrashIcon,
} from '../../../shared/icons';
import { toast } from '../../../shared/toast';
import { ActionMenu, type ActionMenuButtonProps } from '../../../shared/ui';
import { ConfirmDialog } from '../../../shared/ui/ConfirmDialog';
import { useDeleteProject, useProjects, useUpdateProject } from '../hooks';
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

  const handleFavoriteClick = async (projectId: string | null) => {
    if (!projectId) return;
    const found = projects.find((p) => p.id === projectId);
    if (!found) return;
    const updated = { ...found, isFavorite: !found.isFavorite };
    await updateProject(updated)
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

  const isFavorite = projects.find((p) => p.id === menu.id)?.isFavorite;

  const actions: ActionMenuButtonProps['actions'] = [
    {
      icon: <Box component={isFavorite ? StarOffIcon : StarIcon} />,
      label: isFavorite ? 'Remove from Favorites' : 'Add to Favorites',
      onClick: () => handleFavoriteClick(menu.id),
    },
    {
      icon: <PencilIcon />,
      label: 'Edit',
      onClick: () => {
        setProjectId(menu.id);
        setProjectForm(true);
      },
    },
    {
      icon: <TrashIcon />,
      label: 'Delete',
      color: 'error',
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
        onClose={() => setMenu((prev) => ({ ...prev, anchorEl: null }))}
        onTransitionExited={() => setMenu((prev) => ({ ...prev, id: null }))}
        anchorEl={menu.anchorEl}
        actions={actions}
      />
    </Stack>
  );
}
