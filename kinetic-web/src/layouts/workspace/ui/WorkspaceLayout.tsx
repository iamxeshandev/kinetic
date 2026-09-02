import { Box, Container } from '@mui/material';
import { AnimatePresence, motion } from 'motion/react';
import {
  MdAssignment,
  MdCalendarMonth,
  MdDashboard,
  MdGroups,
} from 'react-icons/md';
import { useLocation, useOutlet, useParams } from 'react-router';
import { useAuthContext } from '../../../features/auth/context';
import { paths } from '../../../routes';
import { useResizeObserver } from '../../../shared/hooks';
import { Header } from './Header';
import { NavbarDesktop, type NavbarDesktopProps } from './NavbarDesktop';
import { NavbarMobile } from './NavbarMobile';

export function WorkspaceLayout() {
  const { workspaceId } = useParams();

  const { user } = useAuthContext();

  const location = useLocation();

  const outlet = useOutlet();

  const { ref: navbarDesktopRef, width } = useResizeObserver();
  const { ref: navbarMobileRef, height } = useResizeObserver();

  const navLinks: NavbarDesktopProps['navLinks'] = [
    {
      label: 'Dashboard',
      icon: <MdDashboard />,
      path: paths.workspaces.dashboard(workspaceId ?? 'undefined'),
    },
    {
      label: 'Projects',
      icon: <MdAssignment />,
      path: paths.workspaces.projects.root(workspaceId ?? 'undefined'),
    },
    {
      label: 'Calendar',
      icon: <MdCalendarMonth />,
      path: paths.workspaces.calendar(workspaceId ?? 'undefined'),
    },
    ...(!user?.currentWorkspace?.isPersonal
      ? [
          {
            label: 'Users',
            icon: <MdGroups />,
            path: paths.workspaces.users(workspaceId ?? 'undefined'),
          },
        ]
      : []),
  ];

  return (
    <>
      <Header sx={{ ml: { xs: 0, sm: `${width}px` } }} />

      <NavbarDesktop ref={navbarDesktopRef} navLinks={navLinks} />

      <Container
        component={'main'}
        maxWidth={false}
        sx={{
          p: 2,
          overflowX: 'hidden',
          width: { xs: 1, sm: `calc(100% - ${width}px)` },
          ml: { xs: 0, sm: `${width}px` },
          mb: { xs: `${height}px`, sm: 0 },
        }}
      >
        <AnimatePresence mode='wait'>
          <Box
            key={location.pathname}
            component={motion.div}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.2 }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              width: 1,
            }}
          >
            {outlet}
          </Box>
        </AnimatePresence>
      </Container>

      <NavbarMobile ref={navbarMobileRef} navLinks={navLinks} />
    </>
  );
}

export { WorkspaceLayout as Component };
