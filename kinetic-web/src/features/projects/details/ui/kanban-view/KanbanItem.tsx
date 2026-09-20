import { useSortable } from '@dnd-kit/react/sortable';
import { Avatar, Box, Card, Divider, Stack, Typography } from '@mui/material';
import type { EPriority, TaskDto } from '../../../../../shared/api';
import { formatDate, getInitials } from '../../../../../shared/helpers';
import { Label } from '../../../../../shared/ui';
import type { ColorToken } from '../../../../../theme';
import type { DraggableItem } from './KanbanView';

const PRIORITY_COLORS: Record<Exclude<EPriority, 'None'>, ColorToken> = {
  Low: 'info',
  Medium: 'warning',
  High: 'error',
};

export type KanbanItemProps = {
  index: number;
  id: string;
  sectionId: string;
  task?: TaskDto;
  onEditTask?: (
    event: React.MouseEvent<HTMLDivElement>,
    taskId: string,
  ) => void;
};

export function KanbanItem({
  index,
  id,
  sectionId,
  task,
  onEditTask,
}: KanbanItemProps) {
  const { ref, isDragging } = useSortable({
    id,
    index,
    type: 'item' satisfies DraggableItem,
    accept: 'item' satisfies DraggableItem,
    group: sectionId,
  });

  if (!task) return null;

  return (
    <Card
      ref={ref}
      onClick={(e) => onEditTask?.(e, id)}
      sx={{
        p: 2,
        scale: isDragging ? 1.05 : 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        flexShrink: 0,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {task.priority !== 'None' && (
          <Label color={PRIORITY_COLORS[task.priority]} size='small'>
            <Box
              sx={{
                width: 8,
                height: 8,
                backgroundColor: `${PRIORITY_COLORS[task.priority]}.main`,
                borderRadius: 50,
                mr: 1,
                opacity: 0.9,
              }}
            />
            {task.priority}
          </Label>
        )}
      </Box>

      <Typography variant='subtitle1'>{task?.name}</Typography>

      <Divider />

      <Stack direction={'row'} spacing={1} sx={{ alignItems: 'center' }}>
        <Typography variant='caption'>
          {formatDate(task.dueDate, 'short')}
        </Typography>

        {!!task.attachments?.length && (
          <Typography variant='caption'>{task.attachments?.length}</Typography>
        )}

        <Box sx={{ flex: 1 }} aria-hidden />

        {!!task.assignee && (
          <Avatar size='small'>
            {getInitials(
              `${task.assignee.firstName} ${task.assignee.lastName}`,
            )}
          </Avatar>
        )}
      </Stack>
    </Card>
  );
}
