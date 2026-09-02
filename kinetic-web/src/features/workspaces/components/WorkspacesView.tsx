import { Button, Stack } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { paths } from '../../../routes';
import { AddIcon } from '../../../shared/components/icons';
import { ConfirmDialog } from '../../../shared/components/ui/ConfirmDialog';
import { PageHeader } from '../../../shared/components/ui/PageHeader';
import { toast } from '../../../shared/toast';
import { useAuthContext } from '../../auth/context';
import { workspacesApi } from '../api';
import { useDeleteWorkspace, useWorkspaces } from '../hooks';
import type { Workspace } from '../types';
import { WorkspaceForm } from './WorkspaceForm';
import { WorkspaceGrid } from './WorkspaceGrid';

export function WorkspacesView() {
  const { user, setUser } = useAuthContext();
  const navigate = useNavigate();

  const { data: workspaces = [] } = useWorkspaces();
  const { trigger: deleteWorkspace, isMutating: isDeleting } =
    useDeleteWorkspace();

  const [workspaceId, setWorkspaceId] = useState<Workspace['id'] | null>(null);
  const [form, setForm] = useState<boolean>(false);
  const [confirm, setConfirm] = useState<boolean>(false);

  const handleOpenClick = (workspaceId: Workspace['id']) => {
    if (user?.currentWorkspace?.id === workspaceId) {
      navigate(paths.workspaces.dashboard(workspaceId), { replace: true });
      return;
    }

    workspacesApi.switch(workspaceId).then((res) => {
      if (!res.data) return;
      setUser((prev) =>
        prev
          ? {
              ...prev,
              currentWorkspace: res.data!.currentWorkspace,
            }
          : undefined,
      );
      if (res.data!.currentWorkspace) {
        navigate(paths.workspaces.dashboard(res.data.currentWorkspace.id), {
          replace: true,
        });
      }
    });
  };

  const handleEditClick = (workspaceId: Workspace['id']) => {
    setWorkspaceId(workspaceId);
    setForm(true);
  };

  const handleDeleteClick = (workspaceId: Workspace['id']) => {
    setWorkspaceId(workspaceId);
    setConfirm(true);
  };

  const handleDeleteWorkspace = () => {
    if (workspaceId) {
      deleteWorkspace(workspaceId)
        .then((res) => {
          toast.success(res.message);
          setConfirm(false);
        })
        .catch((err) => toast.error(err.message));
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <PageHeader
          title='Workspaces'
          subtitle='Select a workspace to continue or create a new one.'
          actions={
            <Button startIcon={<AddIcon />} onClick={() => setForm(true)}>
              Create Workspace
            </Button>
          }
        />

        <WorkspaceGrid
          workspaces={workspaces}
          onOpenClick={handleOpenClick}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
        />
      </Stack>

      <WorkspaceForm
        open={form}
        onClose={() => setForm(false)}
        onExited={() => setWorkspaceId(null)}
        workspace={workspaces.find((w) => w.id === workspaceId)}
      />

      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        title='Delete Workspace'
        subtitle='Are you sure you want to delete the workspace?'
        strict
        action={
          <Button
            color='error'
            onClick={handleDeleteWorkspace}
            loading={isDeleting}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}
