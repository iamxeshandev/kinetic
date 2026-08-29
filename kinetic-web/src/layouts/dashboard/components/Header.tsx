import {
  Avatar,
  Box,
  IconButton,
  InputAdornment,
  TextField,
  type BoxProps,
} from '@mui/material';
import { useState } from 'react';
import { LuBell, LuLogOut, LuSearch, LuSettings, LuUser } from 'react-icons/lu';
import { useNavigate } from 'react-router';
import { config } from '../../../config';
import { authApi } from '../../../features/auth/api';
import { removeUserSession } from '../../../features/auth/helpers';
import { paths } from '../../../routes/paths';
import { toast } from '../../../shared/toast';
import {
  ActionMenu,
  Logo,
  ThemeSwitcher,
  type ActionMenuProps,
} from '../../../shared/ui';

export function Header({ sx, ...props }: BoxProps) {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleSignOut = () =>
    authApi
      .logout()
      .then(() => {
        removeUserSession();
        navigate(paths.auth.signIn);
      })
      .catch(toast.error);

  const menuActions: ActionMenuProps['actions'] = [
    { label: 'Profile', icon: <LuUser />, onClick: () => {} },
    { label: 'Settings', icon: <LuSettings />, onClick: () => {} },
    {
      label: 'Logout',
      icon: <LuLogOut />,
      onClick: handleSignOut,
      color: 'error',
    },
  ];

  return (
    <Box
      id='dashboard-layout-header'
      component={'header'}
      className='glass'
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 2,
        ...sx,
      }}
      {...props}
    >
      <Logo sx={{ display: { xs: 'inherit', sm: 'none' } }} />

      <TextField
        fullWidth
        placeholder={`Search across ${config.appName}`}
        size='small'
        sx={{ maxWidth: 300, display: { xs: 'none', sm: 'inherit' } }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position='start'>
                <LuSearch />
              </InputAdornment>
            ),
            sx: { borderRadius: 10 },
          },
        }}
      />

      <Box sx={{ flex: 1 }} aria-hidden />

      <IconButton
        aria-label='Search'
        sx={{ display: { xs: 'inherit', sm: 'none' } }}
      >
        <LuSearch />
      </IconButton>

      <IconButton aria-label='Notifications'>
        <LuBell />
      </IconButton>

      <ThemeSwitcher />

      <IconButton
        sx={{ p: 0 }}
        aria-label='Profile'
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        <Avatar sx={{ width: 36, height: 36 }}>JD</Avatar>
      </IconButton>

      <ActionMenu
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorEl={anchorEl}
        actions={menuActions}
      />
    </Box>
  );
}
