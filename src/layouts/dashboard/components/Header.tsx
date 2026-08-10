import {
  Avatar,
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useMediaQuery,
  type BoxProps,
} from '@mui/material';
import { LuBell, LuSearch } from 'react-icons/lu';
import { NavLink } from 'react-router';
import { config } from '../../../config';
import { paths } from '../../../routes/paths';

export function Header({ sx, ...props }: BoxProps) {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  return (
    <Box
      component={'header'}
      sx={{
        borderBottom: (theme) => `2px solid ${theme.palette.divider}`,
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

      <IconButton sx={{ p: 0 }} aria-label='Profile'>
        <Avatar sx={{ width: 36, height: 36 }}>JD</Avatar>
      </IconButton>
    </Box>
  );
}
