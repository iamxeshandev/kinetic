import {
  Box,
  Breadcrumbs,
  Button,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import { NavLink, useParams } from 'react-router';
import { paths } from '../../../../routes';
import { AddIcon } from '../../../../shared/components/icons';
import { useBoolean } from '../../../../shared/hooks';
import type { Project } from '../../types';
import { TaskDetails } from './task-details/TaskDetails';

export type HeaderSectionProps = {
  project: Project;
};

export function HeaderSection({ project }: HeaderSectionProps) {
  const { workspaceId } = useParams();

  const taskForm = useBoolean();

  return (
    <>
      <Stack spacing={1}>
        <Breadcrumbs>
          <Link
            component={NavLink}
            to={paths.workspaces.projects.root(workspaceId!)}
          >
            Projects
          </Link>
          <Typography>{project.name}</Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant='h2' sx={{ flex: 1 }}>
            {project.name}
          </Typography>

          <Button
            startIcon={<AddIcon />}
            onClick={(event) => {
              event.currentTarget.blur();
              taskForm.setTrue();
            }}
          >
            Create Task
          </Button>
        </Box>
      </Stack>

      <TaskDetails open={taskForm.value} onClose={taskForm.setFalse} />
    </>
  );
}
