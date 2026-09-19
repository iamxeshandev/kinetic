import { Box, Drawer, Stack, Typography } from '@mui/material';
import type { TaskDto } from '../../../../../shared/api';
import { AttachmentsSection } from './AttachmentsSection';
import { OverviewSection } from './OverviewSection';
import { SubtasksSection } from './SubtasksSection';

export type TaskFormProps = {
  open: boolean;
  onClose: VoidFunction;
  task?: TaskDto;
};

export function TaskDetailsView({ open, onClose, task }: TaskFormProps) {
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
        <OverviewSection open={open} task={task} />
        <SubtasksSection />
        <AttachmentsSection />
      </Stack>
    </Drawer>
  );
}
