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
import type { EWorkspaceRole, UserDto } from '../../../shared/api';
import { MoreIcon } from '../../../shared/icons';
import { useAuthContext } from '../../auth/context';
import { workspaceRoleRankMap } from '../../workspaces/constants';

const COLUMNS = ['Name', 'Email', 'Role', ''];

const ALLOWED_ROLES: EWorkspaceRole[] = ['Owner', 'Admin', 'Manager'];

export type UsersListProps = {
  users: UserDto[];
  onMenuClick: (
    event: React.MouseEvent<HTMLButtonElement>,
    userId: string,
  ) => void;
};

export const UsersList = ({ users, onMenuClick }: UsersListProps) => {
  const { user: currentUser } = useAuthContext();

  const isAllowed = ALLOWED_ROLES.includes(
    currentUser?.activeWorkspace?.role ?? 'Member',
  );

  return (
    <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {COLUMNS.map((column, index) => (
              <TableCell key={index}>{column}</TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell align='right'>
                {isAllowed &&
                  workspaceRoleRankMap[
                    currentUser?.activeWorkspace?.role ?? 'Member'
                  ] > workspaceRoleRankMap[user.role] && (
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
