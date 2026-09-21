import {
  Card,
  CircularProgress,
  InputAdornment,
  TextField,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { useCreateTask } from '../../hooks';

export function NewKanbanItem({
  sectionId,
  onClose,
}: {
  sectionId: string;
  onClose: VoidFunction;
}) {
  const { workspaceId, projectId } = useParams();

  const { trigger: createTask, isMutating: isCreating } = useCreateTask(
    workspaceId!,
    projectId!,
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState('');

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const cancelCreateTask = () => {
    onClose();
    setValue('');
  };

  const handleCreateTask = async () => {
    if (isCreating) return;
    const name = value.trim();
    if (!name) {
      cancelCreateTask();
      return;
    }
    await createTask({
      sectionId,
      name,
      description: null,
      priority: 'None',
      dueDate: null,
      assigneeId: null,
    })
      .then(() => cancelCreateTask())
      .catch((err) => console.error(err));
  };

  return (
    <Card sx={{ p: 2 }}>
      <TextField
        inputRef={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        fullWidth
        placeholder='New Task'
        variant='standard'
        multiline
        disabled={isCreating}
        onBlur={isCreating ? undefined : handleCreateTask}
        onKeyDown={async (e) => {
          if (e.key === 'Escape') {
            e.stopPropagation();
            onClose();
          }
          if (e.key === 'Enter' && !e.shiftKey) {
            await handleCreateTask();
          }
        }}
        slotProps={{
          input: {
            endAdornment: isCreating && (
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
