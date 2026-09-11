import { useSortable } from '@dnd-kit/react/sortable';
import { Box, Card, Typography } from '@mui/material';
import { Label } from '../../../../../shared/components/ui';
import type { Callback } from '../../../../../shared/types';
import type { Section, Task } from '../../types';

type SortableTaskProps = {
  index: number;
  id: Task['id'];
  sectionId: Section['id'];
  task?: Task;
  onEditTask?: Callback<
    [event: React.MouseEvent<HTMLDivElement>, taskId: Task['id']]
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
