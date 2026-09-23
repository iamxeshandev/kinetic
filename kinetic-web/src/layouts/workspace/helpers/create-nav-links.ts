import { paths } from '../../../routes';
import {
  CalendarIcon,
  DashboardIcon,
  ProjectsIcon,
  UsersIcon,
} from '../../../shared/icons';
import type { NavLink } from '../types/nav-links';

export const createNavLinks = (
  workspaceId: string,
  isPersonal: boolean,
): NavLink[] => [
  {
    label: 'Dashboard',
    icon: DashboardIcon,
    to: paths.workspaces.dashboard(workspaceId),
  },
  {
    label: 'Projects',
    icon: ProjectsIcon,
    to: paths.workspaces.projects.root(workspaceId),
  },
  {
    label: 'Calendar',
    icon: CalendarIcon,
    to: paths.workspaces.calendar(workspaceId),
  },
  ...(isPersonal
    ? []
    : [
        {
          label: 'Users',
          icon: UsersIcon,
          to: paths.workspaces.users(workspaceId),
        },
      ]),
];
