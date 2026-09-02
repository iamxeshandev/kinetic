import { Box, IconButton } from '@mui/material';
import { forwardRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { varAlpha } from '../../../shared/helpers';

export type NavbarMobileProps = {
  navLinks: Array<{
    label: string;
    icon: React.ReactElement;
    path: string;
  }>;
};

export const NavbarMobile = forwardRef(
  ({ navLinks }: NavbarMobileProps, ref: React.Ref<HTMLElement>) => {
    const location = useLocation();
    const navigate = useNavigate();

    return (
      <Box
        ref={ref}
        component={'nav'}
        className='glass'
        sx={{
          position: 'fixed',
          bottom: 0,
          width: 1,
          px: 2,
          py: 1,
          display: { xs: 'flex', sm: 'none' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          zIndex: (theme) => theme.zIndex.appBar,
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        {navLinks.map(({ icon, path }) => {
          const isActive = location.pathname === path;
          return (
            <Box
              key={path}
              sx={{
                width: 60,
                textAlign: 'center',
                borderRadius: 10,
                backgroundColor: isActive
                  ? (theme) =>
                      varAlpha(
                        theme.vars!.palette.primary.mainChannel,
                        theme.vars!.palette.action.activatedOpacity,
                      )
                  : undefined,
              }}
            >
              <IconButton
                color={isActive ? 'primary' : undefined}
                onClick={() => navigate(path)}
              >
                {icon}
              </IconButton>
            </Box>
          );
        })}
      </Box>
    );
  },
);
