import { Box, Button, Stack } from '@mui/material';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { paths } from '../../../../routes';
import {
  PencilIcon,
  StarIcon,
  StarOffIcon,
  TrashIcon,
} from '../../../../shared/components/icons';
import {
  ActionMenu,
  ConfirmDialog,
  type ActionMenuButtonProps,
} from '../../../../shared/components/ui';
import { hasProjectRole } from '../../../../shared/permissions/hasProjectRole';
import { hasWorkspaceRole } from '../../../../shared/permissions/hasWorkspaceRole';
import { toast } from '../../../../shared/toast';
import { useAuthContext } from '../../../auth/context';
import { favoritesApi } from '../../../favorites/api';
import { useDeleteProject, useProjects } from '../../hooks';
import type { Project } from '../../types';
import { AllProjectsSection } from './AllProjectsSection';
import { FavoriteSection } from './FavoriteSection';
import { HeaderSection } from './HeaderSection';
import { ProjectForm } from './ProjectForm';

export function ProjectsView() {
  const { user } = useAuthContext();

  const { workspaceId } = useParams();

  const navigate = useNavigate();

  const { data: projects = [], mutate: mutateProjects } = useProjects(
    workspaceId!,
  );

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

  const handleToggleFavorite = async (projectId: Project['id']) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;
    const callback = project.isFavorite
      ? favoritesApi.delete
      : favoritesApi.create;

    callback('Project', project.id)
      .then((res) => {
        mutateProjects((prev) =>
          prev?.map((p) =>
            p.id === project.id ? { ...p, isFavorite: !project.isFavorite } : p,
          ),
        );
        toast.success(res.data.message);
      })
      .catch((err) => toast.error(err.message));
  };

  const handleOpenProject = (projectId: Project['id']) => {
    navigate(
      `${paths.workspaces.projects.details(workspaceId!, projectId)}?view=board`,
    );
  };

  const handleCreateClick = () => {
    setProjectId(null);
    setProjectForm(true);
  };

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
      .catch((err) => toast.error(err.message));

  const isFavorite = projects.find((p) => p.id === menu.id)?.isFavorite;

  const userProjectRole = projects
    .find((p) => p.id === menu.id)
    ?.team.find((t) => t.id === user?.id)?.role;

  const canEdit =
    hasWorkspaceRole(user?.currentWorkspace?.role ?? 'Member', 'Admin') ||
    hasProjectRole(userProjectRole ?? 'Member', 'Owner');

  const canDelete =
    hasWorkspaceRole(user?.currentWorkspace?.role ?? 'Member', 'Admin') ||
    hasProjectRole(userProjectRole ?? 'Member', 'Owner');

  const actions: ActionMenuButtonProps['actions'] = [
    {
      icon: <Box component={isFavorite ? StarOffIcon : StarIcon} />,
      label: isFavorite ? 'Remove from Favorites' : 'Add to Favorites',
      onClick: () => handleToggleFavorite(menu.id!),
    },
    ...(canEdit
      ? [
          {
            icon: <PencilIcon />,
            label: 'Edit',
            onClick: () => {
              setProjectId(menu.id);
              setProjectForm(true);
            },
          },
        ]
      : []),
    ...(canDelete
      ? [
          {
            icon: <TrashIcon />,
            label: 'Delete',
            color: 'error' as const,
            onClick: () => {
              setProjectId(menu.id);
              setConfirmDialog(true);
            },
          },
        ]
      : []),
  ];

  return (
    <Stack spacing={3} sx={{ flex: 1 }}>
      <HeaderSection onCreateClick={handleCreateClick} />

      <FavoriteSection
        favoriteProjects={projects.filter((p) => p.isFavorite)}
        onFavoriteClick={handleToggleFavorite}
        onProjectClick={handleOpenProject}
        actions={actions}
      />
      <AllProjectsSection
        projects={projects}
        onOpenProjectClick={handleOpenProject}
        onMoreClick={handleMoreClick}
      />

      <ProjectForm
        open={projectForm}
        onClose={() => setProjectForm(false)}
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
