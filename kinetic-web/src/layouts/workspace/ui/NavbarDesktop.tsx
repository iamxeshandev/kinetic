import { Box, Drawer, IconButton } from '@mui/material';
import { forwardRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Logo } from '../../../shared/components/ui';
import { varAlpha } from '../../../shared/helpers';

export type NavbarDesktopProps = {
  navLinks: Array<{
    label: string;
    icon: React.ReactElement;
    path: string;
  }>;
};

export const NavbarDesktop = forwardRef(
  ({ navLinks }: NavbarDesktopProps, ref: React.Ref<HTMLElement>) => {
    const location = useLocation();

    const navigate = useNavigate();

    return (
      <Drawer
        component={'nav'}
        variant='permanent'
        slotProps={{ paper: { ref: ref } }}
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
          <Logo sx={{ mb: 2, width: 32 }} />

          {navLinks.map(({ icon, path }) => {
            const isActive = location.pathname.includes(path);
            return (
              <Box
                key={path}
                sx={{
                  bgcolor: isActive
                    ? (theme) =>
                        varAlpha(
                          theme.vars!.palette.primary.mainChannel,
                          theme.vars!.palette.action.activatedOpacity,
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
