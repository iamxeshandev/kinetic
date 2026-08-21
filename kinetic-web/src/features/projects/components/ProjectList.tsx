import {
  Avatar,
  AvatarGroup,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { LuArrowRight } from 'react-icons/lu';
import {
  ActionMenuIconButton,
  type ActionMenuIconButtonProps,
} from '../../../components/ui';
import { FavoriteIconButton } from '../../../components/ui/FavoriteIconButton';
import { formatDate } from '../../../utils/helpers';
import type { Project } from '../types/types';
import { ProjectHealth } from './ProjectHealth';
import { ProjectProgress } from './ProjectProgress';

const COLUMNS = [
  'Project',
  'Health',
  'Progress',
  'Lead',
  'Due Date',
  'Team',
  '',
];

export type ProjectListProps = {
  projects: Project[];
  onFavoriteClick: (projectId: Project['id']) => void;
  onProjectClick: (projectId: Project['id']) => void;
  actions: ActionMenuIconButtonProps['actions'];
};

export default function ProjectList({
  projects,
  onFavoriteClick,
  onProjectClick,
  actions,
}: ProjectListProps) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {COLUMNS.map((column) => (
              <TableCell key={column} variant='head'>
                {column}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map((p) => {
            const isCompleted = p.completedTasks === p.tasks;
            return (
              <TableRow key={p.id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>
                  <ProjectHealth
                    dueDate={p.dueDate}
                    isCompleted={isCompleted}
                  />
                </TableCell>
                <TableCell>
                  {
                    <ProjectProgress
                      value={p.completedTasks}
                      max={p.tasks}
                      showPercentage
                    />
                  }
                </TableCell>
                <TableCell>
                  <Avatar src={p.team[0]} alt={p.team[0]} />
                </TableCell>
                <TableCell>{formatDate(p.dueDate)}</TableCell>
                <TableCell>
                  <AvatarGroup max={3} sx={{ justifyContent: 'flex-end' }}>
                    {p.team.map((name) => (
                      <Avatar key={name} size='small'>
                        {name[0]}
                      </Avatar>
                    ))}
                  </AvatarGroup>
                </TableCell>
                <TableCell align='right'>
                  <FavoriteIconButton
                    isFavorite={p.isFavorite}
                    onClick={() => onFavoriteClick(p.id)}
                  />
                  <IconButton
                    size='small'
                    color='primary'
                    onClick={() => onProjectClick(p.id)}
                  >
                    <LuArrowRight />
                  </IconButton>
                  <ActionMenuIconButton actions={actions} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
