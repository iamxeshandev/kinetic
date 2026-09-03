import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  type BoxProps,
} from '@mui/material';
import { LuBell, LuSearch } from 'react-icons/lu';
import { CONFIG } from '../../../config';
import { WorkspaceSwitcher } from '../../../features/workspaces/ui';
import {
  AccountAvatar,
  Logo,
  ThemeSwitcher,
} from '../../../shared/components/ui';

export function Header({ sx, ...props }: BoxProps) {
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

      <WorkspaceSwitcher />

      <Box sx={{ flex: 1 }} aria-hidden />

      <TextField
        fullWidth
        placeholder={`Search across ${CONFIG.APP_NAME}`}
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

      <AccountAvatar />
    </Box>
  );
}
