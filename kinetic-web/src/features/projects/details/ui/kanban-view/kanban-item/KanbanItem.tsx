import { useSortable } from '@dnd-kit/react/sortable';
import { Box, Card, Typography } from '@mui/material';
import type { TaskDto } from '../../../../../../shared/api';
import { Label } from '../../../../../../shared/ui';
import type { DraggableItem } from '../KanbanView';

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

      {/* <Typography
        variant='subtitle2'
        sx={{
          display: '-webkit-box',
          overflow: 'hidden',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 3,
        }}
      >
        <div dangerouslySetInnerHTML={{__html: generateHtml}}/>
      </Typography> */}
    </Card>
  );
}
