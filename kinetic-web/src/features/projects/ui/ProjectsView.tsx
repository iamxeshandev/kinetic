import { Button, Stack } from '@mui/material';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { paths } from '../../../routes';
import { PencilIcon, TrashIcon } from '../../../shared/icons';
import { toast } from '../../../shared/toast';
import {
  ActionMenu,
  ConfirmDialog,
  type ActionMenuButtonProps,
} from '../../../shared/ui';
import { useAuthContext } from '../../auth/context';
import { hasWorkspaceRole } from '../../workspaces/helpers/has-workspace-role';
import { hasProjectRole } from '../helpers';
import { useDeleteProject, useProjects } from '../hooks/use-projects';
import { AllProjectsSection } from './AllProjectsSection';
import { HeaderSection } from './HeaderSection';
import { ProjectForm } from './ProjectForm';

export function ProjectsView() {
  const { workspaceId } = useParams();

  const navigate = useNavigate();

  const { user } = useAuthContext();

  const [projectId, setProjectId] = useState<string | null>(null);

  const { data: projects = [] } = useProjects(workspaceId!);

  const { trigger: deleteProject, isMutating: isDeleting } = useDeleteProject(
    workspaceId!,
    projectId ?? '',
  );

  const [projectForm, setProjectForm] = useState<boolean>(false);
  const [confirmDialog, setConfirmDialog] = useState<boolean>(false);

  const [menu, setMenu] = useState<{
    anchorEl: HTMLButtonElement | null;
    id: string | null;
  }>({ anchorEl: null, id: null });

  const onCreateClick = () => {
    setProjectId(null);
    setProjectForm(true);
  };

  const onMoreClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string,
  ) => setMenu({ anchorEl: event.currentTarget, id });

  const handleOpenProject = (projectId: string) => {
    navigate(
      `${paths.workspaces.projects.details(workspaceId!, projectId)}?view=board`,
    );
  };

  const handleDeleteProject = () =>
    deleteProject()
      .then((res) => {
        toast.success(res.message);
        setProjectId(null);
        setConfirmDialog(false);
      })
      .catch((err) => toast.error(err.message));

  const userProjectRole =
    projects.find((p) => p.id === menu.id)?.team?.find((t) => t.id === user?.id)
      ?.role ?? 'Member';

  const canEdit =
    hasWorkspaceRole(user?.activeWorkspace?.role, 'Admin') ||
    hasProjectRole(userProjectRole, 'Owner');

  const canDelete =
    hasWorkspaceRole(user?.activeWorkspace?.role, 'Admin') ||
    hasProjectRole(userProjectRole, 'Owner');

  const actions: ActionMenuButtonProps['actions'] = [
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
      <HeaderSection onCreateClick={onCreateClick} />

      <AllProjectsSection
        projects={projects}
        onOpenProjectClick={handleOpenProject}
        onMoreClick={onMoreClick}
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
        content={'Are you sure you want to delete this project?'}
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
