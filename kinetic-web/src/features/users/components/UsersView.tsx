import { Button, Stack } from '@mui/material';
import { useState } from 'react';
import { useParams } from 'react-router';
import { PencilIcon, TrashIcon } from '../../../shared/components/icons';
import {
  ActionMenu,
  type ActionMenuProps,
} from '../../../shared/components/ui';
import { ConfirmDialog } from '../../../shared/components/ui/ConfirmDialog';
import { toast } from '../../../shared/toast';
import { useDeleteUser, useUsers } from '../hooks';
import { HeaderSection } from './HeaderSection';
import { UserForm } from './UserForm';
import { UsersList } from './UsersList';

export function UsersView() {
  const { workspaceId } = useParams();

  const { data: users = [] } = useUsers(workspaceId!);

  const { trigger: deleteUser, isMutating: isDeleting } = useDeleteUser(
    workspaceId!,
  );

  const [userId, setUserId] = useState<string | null>(null);
  const [userForm, setUserForm] = useState<boolean>(false);
  const [confirm, setConfirm] = useState<boolean>(false);

  const [menu, setMenu] = useState<{
    anchorEl: HTMLButtonElement | null;
    id: string | null;
  }>({ anchorEl: null, id: null });

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string,
  ) => setMenu({ anchorEl: event.currentTarget, id });

  const handleDeleteUser = () => {
    if (userId) {
      deleteUser(userId)
        .then((res) => {
          toast.success(res.message);
          setConfirm(false);
        })
        .catch((err) => toast.error(err.message));
    }
  };

  const actions: ActionMenuProps['actions'] = [
    {
      icon: <PencilIcon />,
      label: 'Edit',
      onClick: () => {
        setUserId(menu.id);
        setUserForm(true);
      },
    },
    {
      icon: <TrashIcon />,
      label: 'Delete',
      color: 'error',
      onClick: () => {
        setUserId(menu.id);
        setConfirm(true);
      },
    },
  ];

  return (
    <>
      <Stack spacing={3} sx={{ flex: 1 }}>
        <HeaderSection onCreateClick={() => setUserForm(true)} />
        <UsersList users={users} onMenuClick={handleMenuOpen} />
      </Stack>

      <UserForm
        open={userForm}
        onClose={() => setUserForm(false)}
        onExited={() => setUserId(null)}
        user={users.find((u) => u.id === userId)}
      />

      <ActionMenu
        open={!!menu.anchorEl}
        onClose={() => setMenu((prev) => ({ ...prev, anchorEl: null }))}
        onTransitionExited={() => setMenu((prev) => ({ ...prev, id: null }))}
        anchorEl={menu.anchorEl}
        actions={actions}
      />

      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        title='Delete User'
        subtitle='Are you sure you want to delete the user?'
        strict
        action={
          <Button color='error' onClick={handleDeleteUser} loading={isDeleting}>
            Delete
          </Button>
        }
      />
    </>
  );
}
