import {
  Avatar,
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useColorScheme,
  useMediaQuery,
  type BoxProps,
} from '@mui/material';
import { useState } from 'react';
import {
  LuBell,
  LuContrast,
  LuLogOut,
  LuSearch,
  LuSettings,
  LuUser,
} from 'react-icons/lu';
import { NavLink, useNavigate } from 'react-router';
import { ActionMenu, type ActionMenuProps } from '../../../components/ui';
import { config } from '../../../config';
import { signOut } from '../../../features/auth';
import { paths } from '../../../routes/paths';
import { capitalize } from '../../../utils/capitalize';

export function Header({ sx, ...props }: BoxProps) {
  const navigate = useNavigate();

  const { mode, setMode } = useColorScheme();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const handleSignOut = () => {
    signOut();
    navigate(paths.auth.signIn);
  };

  const menuActions: ActionMenuProps['actions'] = [
    { label: 'Profile', icon: <LuUser />, onClick: () => {} },
    {
      label: capitalize(mode ?? 'system'),
      icon: <LuContrast />,
      onClick: () =>
        setMode(
          mode === 'system' ? 'light' : mode === 'light' ? 'dark' : 'system',
        ),
      closeOnClick: false,
    },
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
      component={'header'}
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        height: 60,
        zIndex: (theme) => theme.zIndex.appBar,
        ...sx,
      }}
      {...props}
    >
      {isMobile ? (
        <Typography
          component={NavLink}
          to={paths.home.root}
          variant='h4'
          color='primary'
        >
          {config.appName}
        </Typography>
      ) : (
        <TextField
          fullWidth
          placeholder={`Search across ${config.appName}`}
          size='small'
          sx={{ maxWidth: 300 }}
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
      )}

      <Box sx={{ flex: 1 }} aria-hidden />

      {isMobile && (
        <IconButton aria-label='Search'>
          <LuSearch />
        </IconButton>
      )}

      <IconButton aria-label='Notifications'>
        <LuBell />
      </IconButton>

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
