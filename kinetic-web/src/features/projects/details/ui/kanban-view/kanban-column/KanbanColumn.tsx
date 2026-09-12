import { CollisionPriority } from '@dnd-kit/abstract';
import { useSortable } from '@dnd-kit/react/sortable';
import { Box, Card, IconButton, Stack, Typography } from '@mui/material';
import React from 'react';
import { useParams } from 'react-router';
import { varAlpha } from '../../../../../../shared/helpers';
import { useBoolean } from '../../../../../../shared/hooks';
import { AddIcon, MoreIcon } from '../../../../../../shared/icons';
import { toast } from '../../../../../../shared/toast';
import type { Callback } from '../../../../../../shared/types';
import { InlineText } from '../../../../../../shared/ui';
import { useUpdateSection } from '../../../hooks';
import type { Section } from '../../../types';
import { NewTask } from './NewItem';

export type KanbanColumnProps = {
  index: number;
  id: Section['id'];
  count: number;
  section?: Section;
  onMoreActionsClick?: Callback<
    [event: React.MouseEvent<HTMLButtonElement>, sectionId: Section['id']]
  >;
  children: React.ReactNode;
};

export function KanbanColumn({
  index,
  id,
  count,
  section,
  onMoreActionsClick,
  children,
}: KanbanColumnProps) {
  const { ref } = useSortable({
    id,
    index,
    type: 'section',
    collisionPriority: CollisionPriority.Low,
    accept: ['task', 'section'],
  });
  const { workspaceId, projectId } = useParams();

  const newTask = useBoolean();

  const { trigger: updateSection, isMutating: isUpdating } = useUpdateSection(
    workspaceId!,
    projectId!,
  );

  const handleUpdateSectionName = async (name: string) => {
    if (!section?.id) return;
    await updateSection({ id: section.id, name })
      .then((res) => toast.success(res.message))
      .catch((err) => toast.error(err.message));
  };

  return (
    <Stack ref={ref} spacing={1}>
      <Card sx={{ p: 1, width: 300 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            sx={{
              fontWeight: 'bold',
              width: 30,
              height: 30,
              display: 'flex',
              flexShrink: 0,
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

          <InlineText
            value={section?.name ?? ''}
            onSave={handleUpdateSectionName}
            loading={isUpdating}
            sx={{ flex: 1, height: 40, display: 'flex', alignItems: 'center' }}
          />

          <IconButton
            size='small'
            aria-label='Add Task'
            onClick={newTask.setTrue}
          >
            <AddIcon />
          </IconButton>

          <IconButton
            size='small'
            aria-label='Section Options'
            onClick={(e) => onMoreActionsClick?.(e, id)}
          >
            <MoreIcon />
          </IconButton>
        </Box>
      </Card>

      {newTask.value && <NewTask sectionId={id} onClose={newTask.setFalse} />}

      {children}
    </Stack>
  );
}
