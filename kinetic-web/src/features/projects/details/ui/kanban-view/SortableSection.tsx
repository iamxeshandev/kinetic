import { CollisionPriority } from '@dnd-kit/abstract';
import { useSortable } from '@dnd-kit/react/sortable';
import { Box, Card, IconButton, Stack, Typography } from '@mui/material';
import React from 'react';
import { AddIcon, MoreIcon } from '../../../../../shared/components/icons';
import { varAlpha } from '../../../../../shared/helpers';
import type { Callback } from '../../../../../shared/types';
import type { Section } from '../../types';

type Props = {
  index: number;
  id: Section['id'];
  count: number;
  section?: Section;
  onCreateTask?: Callback<
    [event: React.MouseEvent<HTMLButtonElement>, sectionId: Section['id']]
  >;
  children: React.ReactNode;
};

export function SortableSection({
  index,
  id,
  count,
  section,
  onCreateTask,
  children,
}: Props) {
  const { ref } = useSortable({
    id,
    index,
    type: 'column',
    collisionPriority: CollisionPriority.Low,
    accept: ['item', 'column'],
  });

  return (
    <Stack ref={ref} spacing={2} sx={{ width: 300 }}>
      <Card sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            sx={{
              fontWeight: 'bold',
              width: 30,
              height: 30,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 50,
              backgroundColor: (theme) =>
                varAlpha(
                  theme.vars!.palette.dividerChannel,
                  theme.vars!.palette.action.selectedOpacity,
                ),
            }}
          >
            {count > 99 ? '99+' : count}
          </Typography>

          <Typography>{section?.name}</Typography>

          <Box sx={{ flex: 1 }} aria-hidden />

          <IconButton
            size='small'
            aria-label='Add Task'
            onClick={(e) => onCreateTask?.(e, id)}
          >
            <AddIcon />
          </IconButton>

          <IconButton size='small' aria-label='Section Options'>
            <MoreIcon />
          </IconButton>
        </Box>
      </Card>

      {children}
    </Stack>
  );
}
