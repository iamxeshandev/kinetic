import { Avatar } from '@mui/material';
import { useNavigate } from 'react-router';
import { authApi } from '../../features/auth/api';
import { removeUserSession } from '../../features/auth/helpers';
import { paths } from '../../routes';
import { LogoutIcon, SettingsIcon, UserIcon } from '../icons';
import { ActionMenuIconButton, type ActionMenuButtonProps } from './ActionMenu';

export function AccountAvatar() {
  const navigate = useNavigate();

  const handleSignOut = () =>
    authApi
      .logout()
      .then(() => {
        removeUserSession();
        navigate(paths.auth.signIn);
      })
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
      <Avatar size='large'>JD</Avatar>
    </ActionMenuIconButton>
  );
}
