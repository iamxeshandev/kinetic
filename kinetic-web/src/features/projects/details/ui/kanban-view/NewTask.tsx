import {
  Card,
  CircularProgress,
  InputAdornment,
  TextField,
} from '@mui/material';
import { useParams } from 'react-router';
import { toast } from '../../../../../shared/toast';
import { useCreateTask } from '../../hooks';
import type { Section, Task } from '../../types';

export function NewTask({
  sectionId,
  onClose,
}: {
  sectionId: Section['id'];
  onClose: VoidFunction;
}) {
  const { workspaceId, projectId } = useParams();

  const { trigger: createTask, isMutating: isSubmitting } = useCreateTask(
    workspaceId!,
    projectId!,
  );

  const handleCreateTask = (event: React.FocusEvent<HTMLInputElement>) => {
    const name = event.currentTarget.value.trim();
    if (!name) {
      onClose();
      return;
    }

    const task: Omit<Task, 'id'> = {
      sectionId,
      name,
      priority: 'None',
    };

    createTask(task)
      .then(onClose)
      .catch((err) => toast.error(err.message));
  };

  return (
    <Card sx={{ p: 2 }}>
      <TextField
        fullWidth
        placeholder='New Task'
        variant='standard'
        multiline
        autoFocus
        onBlur={handleCreateTask}
        disabled={isSubmitting}
        slotProps={{
          input: {
            endAdornment: isSubmitting && (
              <InputAdornment position='end'>
                <CircularProgress size={20} />
              </InputAdornment>
            ),
          },
        }}
      />
    </Card>
  );
}
