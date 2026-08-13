import { alpha, Box, Drawer, IconButton } from '@mui/material';
import { forwardRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router';
import { Logo } from '../../../components/ui';
import { paths } from '../../../routes/paths';

export type NavDesktopProps = {
  navLinks: Array<{
    label: string;
    icon: React.ReactElement;
    path: string;
  }>;
};

export const NavDesktop = forwardRef(
  ({ navLinks }: NavDesktopProps, ref: React.Ref<HTMLElement>) => {
    const location = useLocation();
    const navigate = useNavigate();
    return (
      <Drawer
        component={'nav'}
        variant='permanent'
        slotProps={{ paper: { ref: ref } }}
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
                key={path}
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
    );
  },
);
