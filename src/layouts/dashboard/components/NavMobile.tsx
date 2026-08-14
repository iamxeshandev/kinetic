import { forwardRef } from 'react';

import {
  alpha,
  Box,
  FormControlLabel,
  IconButton,
  Typography,
} from '@mui/material';
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
        ref={ref}
        sx={{
          position: 'fixed',
          bottom: 0,
          width: 1,
          px: 2,
          py: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          zIndex: (theme) => theme.zIndex.appBar,
          backdropFilter: 'var(--backdrop-filter)',
          backgroundColor: (theme) =>
            alpha(
              theme.palette.background.default,
              theme.palette.action.disabledOpacity,
            ),
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        {navLinks.map(({ label, icon, path }) => {
          const isActive = location.pathname === path;
          return (
            <FormControlLabel
              key={path}
              sx={{ m: 0 }}
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
    );
  },
);
