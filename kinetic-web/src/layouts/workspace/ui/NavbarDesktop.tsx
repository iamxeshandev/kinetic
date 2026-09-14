import { Box, Drawer, IconButton, Stack } from '@mui/material';
import { forwardRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { varAlpha } from '../../../shared/helpers';
import { Logo } from '../../../shared/ui';

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
        <Stack
          sx={{
            p: 2,
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Logo isLink={false} sx={{ width: 32, mb: 2 }} />

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
                  borderRadius: 1,
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
        </Stack>
      </Drawer>
    );
  },
);
