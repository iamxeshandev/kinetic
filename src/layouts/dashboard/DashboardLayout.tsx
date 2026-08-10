import { Container } from '@mui/material';
import {
  MdAssignment,
  MdCalendarMonth,
  MdDashboard,
  MdGroups,
} from 'react-icons/md';
import { Outlet } from 'react-router';
import { paths } from '../../routes/paths';
import { Header } from './components/Header';
import { Navbar, type NavbarProps } from './components/Navbar';

export function DashboardLayout() {
  return (
    <>
      <Header sx={{ px: 3, py: 1, ml: { xs: 0, sm: 10 } }} />
      <Navbar navLinks={navLinks} />
      <Container
        component={'main'}
        maxWidth={false}
        sx={{
          p: 3,
          ml: { xs: 0, sm: 10 },
          mb: { xs: 10, sm: 0 },
          maxWidth: 'calc(100svw - 80px)',
        }}
      >
        <Outlet />
      </Container>
    </>
  );
}

const navLinks: NavbarProps['navLinks'] = [
  { label: 'Dashboard', icon: <MdDashboard />, path: paths.dashboard.root },
  { label: 'Projects', icon: <MdAssignment />, path: paths.dashboard.projects },
  {
    label: 'Calendar',
    icon: <MdCalendarMonth />,
    path: paths.dashboard.calendar,
  },
  { label: 'Teams', icon: <MdGroups />, path: paths.dashboard.teams },
];
