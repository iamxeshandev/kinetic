import { Box, Drawer, IconButton, Stack, Typography } from '@mui/material';
import type { TaskDto } from '../../../../../shared/api';
import { CancelIcon } from '../../../../../shared/icons';
import { AttachmentsSection } from './AttachmentsSection';
import { OverviewSection } from './OverviewSection';
import { SubtasksSection } from './SubtasksSection';

export type TaskDetailsViewProps = {
  open: boolean;
  onClose: VoidFunction;
  task?: TaskDto;
};

export function TaskDetailsView({ open, onClose, task }: TaskDetailsViewProps) {
  if (!task) return null;

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
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderBottomColor: 'divider',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography
          variant='overline'
          sx={{
            p: 1,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            backgroundColor: 'background.neutral',
          }}
        >
          TASK-{task.refId.toString().padStart(3, '0')}
        </Typography>

        <Box sx={{ flex: 1 }} aria-hidden />

        <IconButton size='medium' onClick={onClose}>
          <CancelIcon />
        </IconButton>
      </Box>

      <Stack
        spacing={3}
        sx={{ flex: 1, p: 2, overflow: 'auto', position: 'relative' }}
      >
        <OverviewSection task={task} />
        <SubtasksSection task={task} />
        <AttachmentsSection task={task} />
      </Stack>
    </Drawer>
  );
}
