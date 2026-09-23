import { Button, Stack } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { paths } from '../../../routes';
import { switch_ } from '../../../shared/api';
import { AddIcon } from '../../../shared/icons';
import { toast } from '../../../shared/toast';
import { ConfirmDialog } from '../../../shared/ui/ConfirmDialog';
import { PageHeader } from '../../../shared/ui/PageHeader';
import { useAuthContext } from '../../auth/context';
import { useDeleteWorkspace, useWorkspaces } from '../hooks';
import { WorkspaceForm } from './WorkspaceForm';
import { WorkspaceGrid } from './WorkspaceGrid';

export function WorkspacesView() {
  const { user, setUser } = useAuthContext();

  const navigate = useNavigate();

  const { data: workspaces = [] } = useWorkspaces();

  const [workspaceId, setWorkspaceId] = useState<string | null>(null);

  const { trigger: deleteWorkspace, isMutating: isDeleting } =
    useDeleteWorkspace(workspaceId ?? '');

  const [form, setForm] = useState<boolean>(false);
  const [confirm, setConfirm] = useState<boolean>(false);

  const handleSwitchWorkspace = async (workspaceId: string) => {
    const isSame = workspaceId === user?.activeWorkspace?.id;
    if (isSame) {
      return navigate(paths.workspaces.dashboard(workspaceId));
    }
    await switch_({ path: { workspaceId } }).then((res) => {
      const me = res.data.data;
      setUser(me ?? null);
      if (me?.activeWorkspace?.id) {
        navigate(paths.workspaces.dashboard(me.activeWorkspace.id));
      }
    });
  };

  const handleEditClick = (workspaceId: string) => {
    setWorkspaceId(workspaceId);
    setForm(true);
  };

  const handleDeleteClick = (workspaceId: string) => {
    setWorkspaceId(workspaceId);
    setConfirm(true);
  };

  const handleDeleteWorkspace = () =>
    deleteWorkspace()
      .then((res) => {
        toast.success(res.message);
        setConfirm(false);
      })
      .catch((err) => toast.error(err.message));

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
          onOpenClick={handleSwitchWorkspace}
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
        content='Are you sure you want to delete the workspace?'
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
