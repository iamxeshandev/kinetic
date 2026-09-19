import { Avatar } from '@mui/material';
import { useAuthContext } from '../../features/auth/context';
import { logout } from '../api';
import { getInitials } from '../helpers';
import { LogoutIcon, SettingsIcon, UserIcon } from '../icons';
import { toast } from '../toast';
import { ActionMenuIconButton, type ActionMenuButtonProps } from './ActionMenu';

export function AccountAvatar() {
  const { user, setUser } = useAuthContext();

  const initials = getInitials(
    `${user?.firstName ?? 'User'} ${user?.lastName ?? ''}`,
  );

  const handleSignOut = () =>
    logout()
      .then(() => setUser(null))
      .catch((err) => toast.error(err.message));

  const actions: ActionMenuButtonProps['actions'] = [
    { label: 'Profile', icon: <UserIcon />, onClick: () => {} },
    { label: 'Settings', icon: <SettingsIcon />, onClick: () => {} },
    {
      label: 'Logout',
      icon: <LogoutIcon />,
      onClick: handleSignOut,
      color: 'error',
    },
  ];

  return (
    <ActionMenuIconButton actions={actions}>
      <Avatar size='medium'>{initials}</Avatar>
    </ActionMenuIconButton>
  );
}
