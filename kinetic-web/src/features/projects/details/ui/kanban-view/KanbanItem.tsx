import { useSortable } from '@dnd-kit/react/sortable';
import { Avatar, Box, Card, Chip, Stack, Typography } from '@mui/material';
import type { ColorToken } from '../../../../../mui/types';
import type { EPriority, TaskDto } from '../../../../../shared/api';
import { formatDate, getInitials } from '../../../../../shared/helpers';
import {
  AttachmentIcon,
  CalendarIcon,
  SubtasksIcon,
} from '../../../../../shared/icons';
import { Label } from '../../../../../shared/ui';
import { SegmentedProgress } from '../../../../../shared/ui/SegmentedProgress';
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

  const fullName = `${task.assignee?.firstName ?? ''} ${task.assignee?.lastName ?? ''}`;
  const attachmentCount = task.attachments?.length ?? 0;
  const completedSubtaskCount =
    task.subtasks?.filter((subtask) => subtask.completedAt).length ?? 0;
  const subtaskCount = task.subtasks?.length ?? 0;

  const showFooter = !!task.dueDate || !!attachmentCount || !!task.assignee;

  return (
    <Card
      ref={ref}
      onClick={(e) => onEditTask?.(e, id)}
      sx={{
        p: 1,
        flexShrink: 0,
        scale: isDragging ? 1.05 : 1,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        ':hover': {
          outline: 2,
          outlineColor: 'primary.main',
        },
      }}
    >
      <Stack direction={'row'} spacing={1} sx={{ alignItems: 'center' }}>
        <Typography
          variant='overline'
          color='textSecondary'
          sx={{
            p: 0.5,
            backgroundColor: 'background.neutral',
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
          }}
        >
          TASK-{task.refId.toString().padStart(3, '0')}
        </Typography>
        {task.priority !== 'None' && (
          <Label
            color={PRIORITY_COLORS[task.priority]}
            size='small'
            sx={{ textTransform: 'uppercase' }}
          >
            <Box
              sx={{
                width: '0.5rem',
                height: '0.5rem',
                borderRadius: '50%',
                backgroundColor: `${PRIORITY_COLORS[task.priority]}.main`,
              }}
            />
            {task.priority}
          </Label>
        )}
      </Stack>

      <Typography variant='subtitle1'>{task?.name}</Typography>

      {/* Subtasks */}
      {!!task.subtasks?.length && (
        <Box
          sx={{
            p: 1,
            backgroundColor: (theme) => theme.vars!.palette.background.neutral,
            borderRadius: 2,
          }}
        >
          <Typography
            variant='subtitle2'
            color='textSecondary'
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}
          >
            <SubtasksIcon />
            Subtasks
            <Box component={'span'} sx={{ flex: 1 }} aria-hidden />
            {completedSubtaskCount}/{subtaskCount}
          </Typography>

          <SegmentedProgress
            value={completedSubtaskCount}
            segments={subtaskCount}
          />
        </Box>
      )}

      {showFooter && (
        <Stack
          direction={'row'}
          spacing={1}
          sx={{
            alignItems: 'center',
            pt: 1,
            borderTop: 1,
            borderTopColor: 'divider',
          }}
        >
          {/* Due Date */}
          {!!task.dueDate && (
            <Chip
              size='small'
              label={
                <Typography
                  variant='caption'
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                >
                  <CalendarIcon /> {formatDate(task.dueDate, 'short')}
                </Typography>
              }
            />
          )}

          {/* Attachments */}
          {!!attachmentCount && (
            <Typography
              variant='caption'
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <AttachmentIcon /> {attachmentCount}
            </Typography>
          )}

          <Box sx={{ flex: 1 }} aria-hidden />

          {/* Assignee */}
          {!!task.assignee && (
            <Avatar
              size='small'
              src={task.assignee?.avatarUrl ?? undefined}
              alt={fullName}
            >
              {getInitials(fullName)}
            </Avatar>
          )}
        </Stack>
      )}
    </Card>
  );
}
