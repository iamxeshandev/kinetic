import {
  alpha,
  Box,
  Drawer,
  FormControlLabel,
  IconButton,
  Typography,
} from '@mui/material';
import { NavLink, useLocation, useNavigate } from 'react-router';
import { Logo } from '../../../components/ui';
import { paths } from '../../../routes/paths';

export type NavbarProps = {
  navLinks: Array<{ label: string; icon: React.ReactNode; path: string }>;
};

export function Navbar({ navLinks }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav>
      <Drawer
        variant='permanent'
        slotProps={{ paper: { sx: { width: 80 } } }}
        sx={{ display: { xs: 'none', sm: 'block' } }}
      >
        <Box
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <NavLink to={paths.home.root}>
            <Logo sx={{ mb: 2, width: 32 }} />
          </NavLink>

          {navLinks.map(({ icon, path }) => {
            const isActive = location.pathname === path;
            return (
              <Box
                sx={{
                  bgcolor: (theme) =>
                    isActive
                      ? alpha(
                          theme.palette.primary.main,
                          theme.palette.action.activatedOpacity,
                        )
                      : undefined,
                  borderRadius: 2,
                }}
              >
                <IconButton
                  key={path}
                  color={isActive ? 'primary' : undefined}
                  onClick={() => navigate(path)}
                >
                  {icon}
                </IconButton>
              </Box>
            );
          })}
        </Box>
      </Drawer>

      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          width: 1,
          height: 80,
          px: 3,
          py: 1,
          display: { xs: 'flex', sm: 'none' },
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {navLinks.map(({ label, icon, path }) => {
          const isActive = location.pathname === path;
          return (
            <FormControlLabel
              key={path}
              label={
                <Typography
                  color={isActive ? 'primary' : undefined}
                  sx={{ fontSize: '0.75rem' }}
                >
                  {label}
                </Typography>
              }
              labelPlacement='bottom'
              control={
                <Box
                  sx={{
                    minWidth: 60,
                    textAlign: 'center',
                    backgroundColor: (theme) =>
                      isActive
                        ? alpha(
                            theme.palette.primary.main,
                            theme.palette.action.activatedOpacity,
                          )
                        : undefined,
                    borderRadius: 10,
                  }}
                >
                  <IconButton
                    color={isActive ? 'primary' : undefined}
                    onClick={() => navigate(path)}
                  >
                    {icon}
                  </IconButton>
                </Box>
              }
            />
          );
        })}
      </Box>
    </nav>
  );
}
