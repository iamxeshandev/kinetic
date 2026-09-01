import { Box, Container } from '@mui/material';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import {
  MdAssignment,
  MdCalendarMonth,
  MdDashboard,
  MdGroups,
} from 'react-icons/md';
import { useLocation, useOutlet, useParams } from 'react-router';
import { useAuthContext } from '../../features/auth/context';
import { paths } from '../../routes';
import { Header } from './components/Header';
import { Navbar, type NavbarProps } from './components/Navbar';

export function WorkspaceLayout() {
  const { workspaceId } = useParams();
  const { user } = useAuthContext();

  const location = useLocation();
  const outlet = useOutlet();

  const [size, setSize] = useState({ width: 0, height: 0 });

  const navbarRef = (node: HTMLElement) => {
    if (node) {
      const { width, height } = node.getBoundingClientRect();
      setSize({ width, height });
    }
  };

  const navLinks = (workspaceId: string): NavbarProps['navLinks'] => [
    {
      label: 'Dashboard',
      icon: <MdDashboard />,
      path: paths.workspaces.dashboard(workspaceId),
    },
    {
      label: 'Projects',
      icon: <MdAssignment />,
      path: paths.workspaces.projects(workspaceId),
    },
    {
      label: 'Calendar',
      icon: <MdCalendarMonth />,
      path: paths.workspaces.calendar(workspaceId),
    },
    ...(!user?.currentWorkspace?.isPersonal
      ? [
          {
            label: 'Users',
            icon: <MdGroups />,
            path: paths.workspaces.users(workspaceId),
          },
        ]
      : []),
  ];

  return (
    <>
      <Header sx={{ ml: { xs: 0, sm: `${size.width}px` } }} />
      <Navbar ref={navbarRef} navLinks={navLinks(workspaceId ?? 'undefined')} />
      <Container
        component={'main'}
        maxWidth={false}
        sx={{
          p: 2,
          mb: { xs: `${size.height}px`, sm: 0 },
          pl: (theme) => ({
            xs: theme.spacing(2),
            sm: `calc(${size.width}px + ${theme.spacing(3)})`,
          }),
          overflowX: 'hidden',
          width: 1,
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
    </>
  );
}

export { WorkspaceLayout as Component };
