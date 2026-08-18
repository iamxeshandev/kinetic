import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { ActionMenuIconButton } from '../../../components/ui';
import { formatDate } from '../../../utils/helpers';
import { ProjectHealth } from './ProjectHealth';
import type { Project } from './ProjectsView';

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
};

export default function ProjectList({ projects }: ProjectListProps) {
  return (
    <TableContainer sx={{ mt: 2 }}>
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
            const isCompleted = p.status === 'completed';
            return (
              <TableRow key={p.id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>
                  <ProjectHealth
                    dueDate={p.dueDate}
                    isCompleted={isCompleted}
                  />
                </TableCell>
                <TableCell>{p.progress}</TableCell>
                <TableCell>{p.team[0]}</TableCell>
                <TableCell>{formatDate(p.dueDate)}</TableCell>
                <TableCell>{p.team.length}</TableCell>
                <TableCell align='right'>
                  <ActionMenuIconButton actions={[]} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
