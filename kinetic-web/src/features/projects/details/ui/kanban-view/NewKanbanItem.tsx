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

  const { trigger, isMutating: isSubmitting } = useCreateTask(
    workspaceId!,
    projectId!,
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState('');

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const reset = () => setValue('');

  const createTask = async () => {
    const name = value.trim();
    if (!name) return;
    try {
      await trigger({
        sectionId,
        name,
        description: null,
        priority: 'None',
        dueDate: null,
        assigneeId: null,
      });

      reset();
    } catch (err) {
      console.log(err);
    }
  };

  const onKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      onClose();
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      await createTask();
    }
  };

  const onBlur = async () => {
    await createTask();
    onClose();
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
        onKeyDown={onKeyDown}
        onBlur={onBlur}
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
