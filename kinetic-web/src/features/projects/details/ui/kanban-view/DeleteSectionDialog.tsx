import {
  Button,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { ConfirmDialog } from '../../../../../shared/components/ui/ConfirmDialog.js';
import { toast } from '../../../../../shared/toast/toast.js';
import type { Callback } from '../../../../../shared/types/callback.js';
import { useDeleteSection } from '../../hooks/useSections.js';
import type { Section } from '../../types/index.js';

type Props = {
  open: boolean;
  onClose: Callback;
  sectionId?: Section['id'];
  hasTasks?: boolean;
  options?: Section[];
};

export function DeleteSectionDialog({
  open,
  onClose,
  sectionId,
  hasTasks,
  options,
}: Props) {
  const { workspaceId, projectId } = useParams();

  const { trigger: deleteSection, isMutating: isDeleting } = useDeleteSection(
    workspaceId!,
    projectId!,
  );

  const [mode, setMode] = useState<'delete' | 'move'>('move');
  const [moveTasksTo, setMoveTasksTo] = useState<Section['id']>('');

  useEffect(() => {
    if (!open || !hasTasks) return;

    const reset = () => {
      setMode('move');
      setMoveTasksTo(options?.[0]?.id ?? '');
    };
    reset();
  }, [hasTasks, open, options]);

  const handleDelete = async () => {
    if (!sectionId) return;

    deleteSection({
      sectionId,
      ...(hasTasks && mode === 'move' && { moveTasksTo }),
      ...(hasTasks && mode === 'delete' && { deleteTasks: true }),
    })
      .then((res) => {
        toast.success(res.message);
        onClose();
      })
      .catch((err) => toast.error(err.message));
  };

  const content = (
    <Stack spacing={1}>
      <Typography>Are you sure you want to delete this section?</Typography>
      {hasTasks && (
        <RadioGroup
          value={mode}
          onChange={(e) => setMode(e.target.value as 'delete' | 'move')}
          sx={{ alignItems: 'start' }}
        >
          <FormControlLabel
            value='move'
            label={<Typography variant='body2'>Move tasks to</Typography>}
            control={<Radio size='small' />}
          />
          <Select
            value={moveTasksTo}
            onChange={(e) => setMoveTasksTo(e.target.value as Section['id'])}
            size='small'
            fullWidth
            sx={{ mb: 1 }}
          >
            {options?.map((section) => (
              <MenuItem key={section.id} value={section.id}>
                {section.name}
              </MenuItem>
            ))}
          </Select>
          <FormControlLabel
            value='delete'
            label={<Typography variant='body2'>Delete tasks</Typography>}
            control={<Radio size='small' />}
          />
        </RadioGroup>
      )}
    </Stack>
  );

  const action = (
    <Button
      variant='contained'
      color='error'
      onClick={handleDelete}
      loading={isDeleting}
      disabled={hasTasks && mode === 'move' && !moveTasksTo}
    >
      Delete
    </Button>
  );

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      title='Delete Section'
      content={content}
      action={action}
    />
  );
}
