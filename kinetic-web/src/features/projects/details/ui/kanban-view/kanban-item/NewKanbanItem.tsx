import {
  Card,
  CircularProgress,
  InputAdornment,
  TextField,
} from '@mui/material';
import { useParams } from 'react-router';
import { toast } from '../../../../../../shared/toast';
import { useCreateTask } from '../../../hooks';

export function NewTask({
  sectionId,
  onClose,
}: {
  sectionId: string;
  onClose: VoidFunction;
}) {
  const { workspaceId, projectId } = useParams();

  const { trigger: createTask, isMutating: isSubmitting } = useCreateTask(
    workspaceId!,
    projectId!,
  );

  const handleCreateTask = (name: string) =>
    name
      ? createTask({
          sectionId,
          name,
          description: null,
          priority: 'None',
          dueDate: null,
          assigneeId: null,
        })
          .then(() => onClose())
          .catch((err) => toast.error(err.message))
      : onClose();

  return (
    <Card sx={{ p: 2 }}>
      <TextField
        fullWidth
        placeholder='New Task'
        variant='standard'
        multiline
        autoFocus
        onBlur={(e) => handleCreateTask(e.currentTarget.value.trim())}
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
