import { Box, Drawer, IconButton, Stack } from '@mui/material';
import { forwardRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { varAlpha } from '../../../shared/helpers';
import { Logo } from '../../../shared/ui';
import type { NavLink } from '../types/nav-links';

export type NavbarDesktopProps = {
  navLinks: NavLink[];
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
        <Stack
          sx={{
            p: 2,
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Logo isLink={false} sx={{ width: 32, mb: 2 }} />

          {navLinks.map(({ icon: Icon, to }) => {
            const isActive = location.pathname.includes(to);
            return (
              <Box
                key={to}
                sx={{
                  bgcolor: isActive
                    ? (theme) =>
                        varAlpha(
                          theme.vars!.palette.primary.mainChannel,
                          theme.vars!.palette.action.activatedOpacity,
                        )
                    : undefined,
                  borderRadius: 1,
                }}
              >
                <IconButton
                  key={to}
                  color={isActive ? 'primary' : undefined}
                  onClick={() => navigate(to)}
                >
                  <Icon />
                </IconButton>
              </Box>
            );
          })}
        </Stack>
      </Drawer>
    );
  },
);
