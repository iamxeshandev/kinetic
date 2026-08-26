import {
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { LuArrowRight } from 'react-icons/lu';
import { MoreIcon } from '../../../components/icons';
import { formatDate } from '../../../utils/helpers';
import type { AllProjectSectionProps } from './AllProjectsSection';
import { ProjectHealth } from './ProjectHealth';

const COLUMNS = [
  'Project',
  'Health',
  'Progress',
  'Lead',
  'Due Date',
  'Team',
  '',
];

export default function ProjectList({
  projects,
  onOpenProjectClick,
  onMoreClick,
}: AllProjectSectionProps) {
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
          {projects.map((project) => {
            const isCompleted = project.status === 'Completed';
            return (
              <TableRow key={project.id}>
                <TableCell>{project.name}</TableCell>
                <TableCell>
                  <ProjectHealth
                    dueDate={project.dueDate}
                    isCompleted={isCompleted}
                  />
                </TableCell>
                <TableCell>
                  {/* <ProjectProgress
                      value={p.completedTasks}
                      max={p.tasks}
                      showPercentage
                    /> */}
                </TableCell>
                <TableCell>
                  {/* <Avatar src={p.team[0]} alt={p.team[0]} /> */}
                </TableCell>
                <TableCell>{formatDate(project.dueDate)}</TableCell>
                <TableCell>
                  {/* <AvatarGroup max={3} sx={{ justifyContent: 'flex-end' }}>
                    {p.team.map((name) => (
                      <Avatar key={name} size='small'>
                        {name[0]}
                      </Avatar>
                    ))}
                  </AvatarGroup> */}
                </TableCell>
                <TableCell>
                  <Stack
                    spacing={1}
                    direction={'row'}
                    sx={{ justifyContent: 'end' }}
                  >
                    <IconButton
                      size='small'
                      color='primary'
                      onClick={() => onOpenProjectClick(project.id)}
                    >
                      <LuArrowRight />
                    </IconButton>
                    <IconButton
                      size='small'
                      onClick={(event) => onMoreClick(event, project.id)}
                    >
                      <MoreIcon />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
