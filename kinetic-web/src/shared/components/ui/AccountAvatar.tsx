import { Avatar } from '@mui/material';
import { authApi } from '../../../features/auth/api';
import { useAuthContext } from '../../../features/auth/context';
import { getInitials } from '../../helpers';
import { LogoutIcon, SettingsIcon, UserIcon } from '../icons';
import { ActionMenuIconButton, type ActionMenuButtonProps } from './ActionMenu';

export function AccountAvatar() {
  const { user, setUser } = useAuthContext();

  const initials = getInitials(user?.fullName ?? 'User');

  const handleSignOut = () =>
    authApi
      .logout()
      .then(() => setUser(undefined))
      .catch((err) => console.error(err));

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
      <Avatar size='large'>{initials}</Avatar>
    </ActionMenuIconButton>
  );
}
