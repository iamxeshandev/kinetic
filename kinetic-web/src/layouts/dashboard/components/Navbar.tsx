import { useMediaQuery } from '@mui/material';
import { forwardRef } from 'react';
import {
  MdAssignment,
  MdCalendarMonth,
  MdDashboard,
  MdGroups,
} from 'react-icons/md';
import { paths } from '../../../routes/paths';
import { NavDesktop, type NavDesktopProps } from './NavDesktop';
import { NavMobile, type NavMobileProps } from './NavMobile';

export const Navbar = forwardRef((_, ref: React.Ref<HTMLElement>) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  return isMobile ? (
    <NavMobile ref={ref} navLinks={navLinks} />
  ) : (
    <NavDesktop ref={ref} navLinks={navLinks} />
  );
});

const navLinks: NavDesktopProps['navLinks'] & NavMobileProps['navLinks'] = [
  { label: 'Dashboard', icon: <MdDashboard />, path: paths.dashboard.root },
  { label: 'Projects', icon: <MdAssignment />, path: paths.dashboard.projects },
  {
    label: 'Calendar',
    icon: <MdCalendarMonth />,
    path: paths.dashboard.calendar,
  },
  { label: 'Teams', icon: <MdGroups />, path: paths.dashboard.teams },
];
