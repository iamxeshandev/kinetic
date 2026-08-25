import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { LuArrowRight } from 'react-icons/lu';
import { MoreIcon } from '../../../components/icons';
import { FavoriteIconButton } from '../../../components/ui/FavoriteIconButton';
import type { AllProjectSectionProps } from './AllProjectsSection';

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
  onFavoriteClick,
  onProjectClick,
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
            // const isCompleted = p.completedTasks === p.tasks;
            return (
              <TableRow key={project.id}>
                <TableCell>{project.name}</TableCell>
                {/* <TableCell>
                  <ProjectHealth
                    dueDate={p.dueDate}
                    isCompleted={isCompleted}
                  />
                </TableCell> */}
                {/* <TableCell>
                  {
                    <ProjectProgress
                      value={p.completedTasks}
                      max={p.tasks}
                      showPercentage
                    />
                  }
                </TableCell> */}
                {/* <TableCell>
                  <Avatar src={p.team[0]} alt={p.team[0]} />
                </TableCell> */}
                {/* <TableCell>{formatDate(p.dueDate)}</TableCell> */}
                {/* <TableCell>
                  <AvatarGroup max={3} sx={{ justifyContent: 'flex-end' }}>
                    {p.team.map((name) => (
                      <Avatar key={name} size='small'>
                        {name[0]}
                      </Avatar>
                    ))}
                  </AvatarGroup>
                </TableCell> */}
                <TableCell align='right'>
                  <FavoriteIconButton
                    isFavorite={project.isFavorite}
                    onClick={() => onFavoriteClick(project.id)}
                  />
                  <IconButton
                    size='small'
                    color='primary'
                    onClick={() => onProjectClick(project.id)}
                  >
                    <LuArrowRight />
                  </IconButton>
                  <IconButton
                    size='small'
                    onClick={(event) => onMoreClick(event, project.id)}
                  >
                    <MoreIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
