import { useSortable } from '@dnd-kit/react/sortable';
import { Box, Card, IconButton, Typography } from '@mui/material';
import { MoreIcon, PencilIcon } from '../../../../../shared/components/icons';
import { Label } from '../../../../../shared/components/ui';
import type { Callback } from '../../../../../shared/types';
import type { Section, Task } from '../../types';

type SortableTaskProps = {
  index: number;
  id: Task['id'];
  sectionId: Section['id'];
  task?: Task;
  onEditTask?: Callback<
    [event: React.MouseEvent<HTMLButtonElement>, taskId: Task['id']]
  >;
};

export function SortableTask({
  index,
  id,
  sectionId,
  task,
  onEditTask,
}: SortableTaskProps) {
  const { ref, isDragging } = useSortable({
    id,
    index,
    type: 'item',
    accept: 'item',
    group: sectionId,
  });

  return (
    <Card
      ref={ref}
      sx={{
        p: 2,
        scale: isDragging ? 1.05 : 1,
        '&:hover .task-actions, &:focus-within .task-actions': {
          opacity: 1,
          visibility: 'visible',
        },
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Label color='error' size='small'>
          <Box
            sx={{
              width: 8,
              height: 8,
              backgroundColor: 'error.main',
              borderRadius: 50,
              mr: 1,
              opacity: 0.9,
            }}
          />
          High
        </Label>
        <Box sx={{ flex: 1 }} aria-hidden />
        <Box
          className='task-actions'
          sx={{
            display: 'flex',
            gap: 0.5,
            opacity: 0,
            visibility: 'hidden',
            transition: 'opacity 150ms ease, visibility 150ms ease',
          }}
        >
          <IconButton
            size='small'
            aria-label='Edit Task'
            onClick={(e) => onEditTask?.(e, id)}
          >
            <PencilIcon />
          </IconButton>
          <IconButton size='small' aria-label='Task Options'>
            <MoreIcon />
          </IconButton>
        </Box>
      </Box>

      <Typography sx={{ fontWeight: 'bold' }}>{task?.name}</Typography>

      <Typography
        variant='subtitle2'
        sx={{
          display: '-webkit-box',
          overflow: 'hidden',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 3,
        }}
      >
        {task?.description}
      </Typography>
    </Card>
  );
}
