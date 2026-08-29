import { Box, Container } from '@mui/material';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import {
  MdAssignment,
  MdCalendarMonth,
  MdDashboard,
  MdGroups,
} from 'react-icons/md';
import { Navigate, useLocation, useOutlet } from 'react-router';
import { getUserSession } from '../../features/auth/helpers';
import { paths } from '../../routes';
import { Header } from './components/Header';
import { Navbar, type NavbarProps } from './components/Navbar';

export function DashboardLayout() {
  const location = useLocation();
  const outlet = useOutlet();

  const [size, setSize] = useState({ width: 0, height: 0 });

  const navbarRef = (node: HTMLElement) => {
    if (node) {
      const { width, height } = node.getBoundingClientRect();
      setSize({ width, height });
    }
  };

  const user = getUserSession();

  return !user ? (
    <Navigate to={paths.auth.signIn} replace />
  ) : (
    <>
      <Header sx={{ ml: { xs: 0, sm: `${size.width}px` } }} />
      <Navbar ref={navbarRef} navLinks={navLinks(user.defaultWorkspaceId)} />
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
          >
            {outlet}
          </Box>
        </AnimatePresence>
      </Container>
    </>
  );
}

export { DashboardLayout as Component };

const navLinks = (workspaceId: string): NavbarProps['navLinks'] => [
  {
    label: 'Dashboard',
    icon: <MdDashboard />,
    path: paths.workspaces(workspaceId).dashboard,
  },
  {
    label: 'Projects',
    icon: <MdAssignment />,
    path: paths.workspaces(workspaceId).projects,
  },
  {
    label: 'Calendar',
    icon: <MdCalendarMonth />,
    path: paths.workspaces(workspaceId).calendar,
  },
  {
    label: 'Teams',
    icon: <MdGroups />,
    path: paths.workspaces(workspaceId).teams,
  },
];
