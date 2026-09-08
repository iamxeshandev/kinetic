import { Box, Drawer, Stack, Typography } from '@mui/material';
import type { Callback } from '../../../../../shared/types';
import { type Task } from '../../types';
import { AttachmentsSection } from './AttachmentsSection';
import { FormSection } from './FormSection';
import { SubtasksSection } from './SubtasksSection';

export type TaskFormProps = {
  open: boolean;
  onClose: Callback;
  task: Task;
};

export function TaskDetails({ open, onClose, task }: TaskFormProps) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor='right'
      slotProps={{
        paper: {
          sx: {
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            width: 600,
          },
        },
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderBottomColor: 'divider' }}>
        <Typography>Header</Typography>
      </Box>

      <Stack
        spacing={3}
        sx={{ flex: 1, p: 2, overflow: 'auto', position: 'relative' }}
      >
        <FormSection open={open} task={task} />
        <SubtasksSection />
        <AttachmentsSection />
      </Stack>
    </Drawer>
  );
}
