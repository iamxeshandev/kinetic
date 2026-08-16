import { forwardRef } from 'react';

import { Box, IconButton } from '@mui/material';
import { useLocation, useNavigate } from 'react-router';

export type NavMobileProps = {
  navLinks: Array<{
    label: string;
    icon: React.ReactElement;
    path: string;
  }>;
};

export const NavMobile = forwardRef(
  ({ navLinks }: NavMobileProps, ref: React.Ref<HTMLElement>) => {
    const location = useLocation();
    const navigate = useNavigate();

    return (
      <Box
        component={'nav'}
        className='glass'
        ref={ref}
        sx={{
          position: 'fixed',
          bottom: -1,
          width: 1,
          px: 2,
          py: 1,
          display: 'flex',
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
                  ? 'rgb(var(--mui-palette-primary-mainChannel) / var(--mui-palette-action-activatedOpacity))'
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
