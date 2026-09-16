import { arrayMove, move } from '@dnd-kit/helpers';
import {
  DragDropProvider,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/react';
import { isSortable } from '@dnd-kit/react/sortable';
import { Stack } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { useBoolean } from '../../../../../shared/hooks';
import { TrashIcon } from '../../../../../shared/icons';
import { toast } from '../../../../../shared/toast';
import { ActionMenu } from '../../../../../shared/ui';
import { sectionsApi, tasksApi } from '../../api';
import { useSections, useTasks } from '../../hooks';
import type { Section, Task } from '../../types';
import { TaskDetailsView } from '../task-details-view';
import { CreateSectionButton } from './CreateSectionButton.js';
import { DeleteSectionDialog } from './DeleteSectionDialog.js';
import { KanbanColumn } from './kanban-column/KanbanColumn.js';
import { KanbanItem } from './kanban-item/KanbanItem.js';

export type DraggableItem = 'column' | 'item';

export default function KanbanView() {
  const { workspaceId, projectId } = useParams();

  const { data: sections = [], mutate: mutateSections } = useSections(
    workspaceId!,
    projectId!,
  );
  const { data: tasks = [] } = useTasks(workspaceId!, projectId!);

  const [taskId, setTaskId] = useState<Task['id'] | undefined>(undefined);
  const taskDetails = useBoolean();

  const [columnMenu, setColumnMenu] = useState<{
    id: Section['id'] | undefined;
    anchorEl: HTMLButtonElement | undefined;
  }>({ id: undefined, anchorEl: undefined });

  const deleteSectionDialog = useBoolean();
  const [deleteSectionId, setDeleteSectionId] = useState<
    Section['id'] | undefined
  >(undefined);

  const sectionsMap = sections.reduce(
    (acc, section) => ({ ...acc, [section.id]: section }),
    {} as Record<Section['id'], Section>,
  );

  const tasksMap = tasks.reduce(
    (acc, task) => ({ ...acc, [task.id]: task }),
    {} as Record<Task['id'], Task>,
  );

  const [items, setItems] = useState<Record<Section['id'], Task['id'][]>>({});

  useEffect(() => {
    const newItems = sections.reduce(
      (acc, section) => {
        acc[section.id] = tasks
          .filter((task) => task.sectionId === section.id)
          .map((task) => task.id);
        return acc;
      },
      {} as Record<Section['id'], Task['id'][]>,
    );
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(newItems);
  }, [sections, tasks]);

  const onEditTask = (
    event: React.MouseEvent<HTMLDivElement>,
    taskId: Task['id'],
  ) => {
    event.currentTarget.blur();
    setTaskId(taskId);
    taskDetails.setTrue();
  };

  const itemLastGroup = useRef<Section['id'] | undefined>(undefined);
  const itemLastIndex = useRef<number | undefined>(undefined);

  const onDragStart = (event: DragStartEvent) => {
    const { source } = event.operation;
    if (!source || !isSortable(source)) return;

    const type = source.type as DraggableItem;

    if (type === 'item') {
      itemLastGroup.current = source.initialGroup as Section['id'];
      itemLastIndex.current = source.initialIndex;
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    const { source } = event.operation;
    if (!source || !isSortable(source)) return;

    const type = source.type as DraggableItem;

    if (type === 'column') return;

    setItems((items) => move(items, event));
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { source } = event.operation;
    if (!source || !isSortable(source)) return;

    const type = source.type as DraggableItem;

    if (type === 'column' && source.initialIndex !== source.index) {
      const currentIndex = source.initialIndex;
      const newIndex = source.index;

      const oldSections = sections;
      const newSections = arrayMove(sections, currentIndex, newIndex);

      const previousSectionId =
        newIndex === 0 ? undefined : newSections[newIndex - 1].id;
      const currentSectionId = source.id as Section['id'];
      const nextSectionId = newSections[newIndex + 1]?.id;

      mutateSections(newSections, false);

      sectionsApi
        .move(workspaceId!, projectId!, currentSectionId, {
          previousSectionId,
          nextSectionId,
        })
        .catch((err) => {
          toast.error(err.message);
          mutateSections(oldSections, false);
        });
    }

    if (
      type === 'item' &&
      (source.group !== itemLastGroup.current ||
        source.index !== itemLastIndex.current)
    ) {
      const sectionId = source.group as Section['id'];
      const sectionTaskIds = items[sectionId];

      const previousTaskId = sectionTaskIds?.[source.index - 1];
      const currentTaskId = source.id as Task['id'];
      const nextTaskId = sectionTaskIds?.[source.index + 1];

      tasksApi
        .move(workspaceId!, projectId!, currentTaskId, {
          sectionId,
          previousTaskId,
          nextTaskId,
        })
        .catch((err) => {
          toast.error(err.message);
        });
    }
  };

  return (
    <>
      <DragDropProvider
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <Stack direction='row' spacing={2} sx={{ p: 0.5, flex: 1 }}>
          {Object.entries(items).map(([sectionId, taskIds], index) => (
            <KanbanColumn
              key={sectionId}
              index={index}
              id={sectionId}
              count={taskIds.length}
              section={sectionsMap[sectionId]}
              onMoreActionsClick={(event, sectionId) =>
                setColumnMenu({ id: sectionId, anchorEl: event.currentTarget })
              }
            >
              {taskIds.map((taskId, index) => (
                <KanbanItem
                  key={taskId}
                  index={index}
                  id={taskId}
                  sectionId={sectionId}
                  task={tasksMap[taskId]}
                  onEditTask={onEditTask}
                />
              ))}
            </KanbanColumn>
          ))}

          <CreateSectionButton />
        </Stack>
      </DragDropProvider>

      <TaskDetailsView
        open={taskDetails.value}
        onClose={taskDetails.setFalse}
        task={tasksMap[taskId!]}
      />

      <ActionMenu
        open={!!columnMenu.anchorEl}
        anchorEl={columnMenu.anchorEl}
        onClose={() => setColumnMenu({ id: undefined, anchorEl: undefined })}
        actions={[
          {
            label: 'Delete',
            icon: <TrashIcon />,
            color: 'error',
            onClick: () => {
              setDeleteSectionId(columnMenu.id);
              deleteSectionDialog.setTrue();
            },
          },
        ]}
      />

      <DeleteSectionDialog
        open={deleteSectionDialog.value}
        onClose={deleteSectionDialog.setFalse}
        sectionId={deleteSectionId}
        hasTasks={items[deleteSectionId ?? '']?.length > 0}
        options={sections.filter((s) => s.id !== deleteSectionId)}
      />
    </>
  );
}
