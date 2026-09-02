import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import type React from 'react';
import { MoreIcon } from '../../../shared/components/icons';
import { formatDate } from '../../../shared/helpers';
import type { Callback } from '../../../shared/types';
import { WORKSPACE_RANKS, type WorkspaceRole } from '../../../shared/types';
import { useAuthContext } from '../../auth/context';
import type { User } from '../types';

const columns = ['Name', 'Email', 'Role', 'Joined', ''];

export type UsersListProps = {
  users: User[];
  onMenuClick: Callback<
    [React.MouseEvent<HTMLButtonElement>, User['id']],
    void
  >;
};

export const UsersList = ({ users, onMenuClick }: UsersListProps) => {
  const { user: currentUser } = useAuthContext();

  const allowedRoles: WorkspaceRole[] = ['Owner', 'Admin', 'Manager'];

  const isAllowed = allowedRoles.includes(
    currentUser?.currentWorkspace?.role ?? 'Member',
  );

  return (
    <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell key={index}>{column}</TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.fullName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{formatDate(user.joinedAt)}</TableCell>
              <TableCell align='right'>
                {isAllowed &&
                  WORKSPACE_RANKS[
                    currentUser?.currentWorkspace?.role ?? 'Member'
                  ] > WORKSPACE_RANKS[user.role] && (
                    <IconButton
                      size='small'
                      onClick={(e) => onMenuClick(e, user.id)}
                    >
                      <MoreIcon />
                    </IconButton>
                  )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
