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
import { moveSection, moveTask } from '../../../../../shared/api/sdk.gen.js';
import type {
  SectionDto,
  TaskDto,
} from '../../../../../shared/api/types.gen.js';
import { useBoolean } from '../../../../../shared/hooks';
import { TrashIcon } from '../../../../../shared/icons';
import { toast } from '../../../../../shared/toast';
import { ActionMenu } from '../../../../../shared/ui';
import { useSections, useTasks } from '../../hooks';
import { TaskDetailsView } from '../task-details-view';
import { CreateSectionButton } from './CreateSectionButton.js';
import { DeleteSectionDialog } from './DeleteSectionDialog.js';
import { KanbanColumn } from './KanbanColumn.js';
import { KanbanItem } from './KanbanItem.js';

export type DraggableItem = 'column' | 'item';

export default function KanbanView() {
  const { workspaceId, projectId } = useParams();

  const { data: sections = [], mutate: mutateSections } = useSections(
    workspaceId!,
    projectId!,
  );

  const { data: tasks = [], mutate: mutateTasks } = useTasks(
    workspaceId!,
    projectId!,
  );

  const [taskId, setTaskId] = useState<string | null>(null);

  const taskDetails = useBoolean();

  const [columnMenu, setColumnMenu] = useState<{
    id: string | null;
    anchorEl: HTMLButtonElement | null;
  }>({ id: null, anchorEl: null });

  const deleteSectionDialog = useBoolean();

  const [deleteSectionId, setDeleteSectionId] = useState<string | null>(null);

  const sectionsMap = sections.reduce(
    (acc, section) => ({ ...acc, [section.id]: section }),
    {} as Record<string, SectionDto>,
  );

  const tasksMap = tasks.reduce(
    (acc, task) => ({ ...acc, [task.id]: task }),
    {} as Record<string, TaskDto>,
  );

  const [items, setItems] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (!sections.length || !tasks.length) return;
    const syncItems = () => {
      const newItems = sections.reduce(
        (acc, section) => {
          acc[section.id] = tasks
            .filter((task) => task.sectionId === section.id)
            .map((task) => task.id);
          return acc;
        },
        {} as Record<string, string[]>,
      );
      setItems(newItems);
    };

    syncItems();
  }, [sections, tasks]);

  const onEditTask = (
    event: React.MouseEvent<HTMLDivElement>,
    taskId: string,
  ) => {
    event.currentTarget.blur();
    setTaskId(taskId);
    taskDetails.setTrue();
  };

  const itemLastGroup = useRef<string>(null);
  const itemLastIndex = useRef<number>(null);

  const onDragStart = (event: DragStartEvent) => {
    const { source } = event.operation;
    if (!source || !isSortable(source)) return;
    const type = source.type as DraggableItem;
    if (type === 'item') {
      itemLastGroup.current = source.initialGroup as string;
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

    // * Sections
    if (type === 'column' && source.initialIndex !== source.index) {
      const currentIndex = source.initialIndex;
      const newIndex = source.index;

      const newSections = arrayMove(sections, currentIndex, newIndex);

      const previousSectionId =
        newIndex === 0 ? null : newSections[newIndex - 1]?.id;
      const currentSectionId = source.id as string;
      const nextSectionId = newSections[newIndex + 1]?.id;

      moveSection({
        path: {
          workspaceId: workspaceId!,
          projectId: projectId!,
          sectionId: currentSectionId,
        },
        body: { previousSectionId, nextSectionId },
      })
        .then(() => mutateSections(newSections, false))
        .catch((err) => {
          toast.error(err.message);
        });
    }

    // * Tasks
    if (
      type === 'item' &&
      (source.group !== itemLastGroup.current ||
        source.index !== itemLastIndex.current)
    ) {
      const sectionId = source.group as string;
      const sectionTaskIds = items[sectionId];

      const previousTaskId = sectionTaskIds?.[source.index - 1];
      const taskId = source.id as string;
      const nextTaskId = sectionTaskIds?.[source.index + 1];

      moveTask({
        path: { workspaceId: workspaceId!, projectId: projectId!, taskId },
        body: { sectionId, previousTaskId, nextTaskId },
      })
        .then((res) =>
          mutateTasks(
            (prev) =>
              prev
                ?.map((t) => (t.id === res.data.data?.id ? res.data.data : t))
                .sort((a, b) => a.position - b.position),
            false,
          ),
        )
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
        task={taskId ? tasksMap[taskId] : undefined}
      />

      <ActionMenu
        open={!!columnMenu.anchorEl}
        anchorEl={columnMenu.anchorEl}
        onClose={() => setColumnMenu({ id: null, anchorEl: null })}
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
        sectionId={deleteSectionId ?? ''}
        hasTasks={items[deleteSectionId ?? '']?.length > 0}
        options={sections.filter((s) => s.id !== deleteSectionId)}
      />
    </>
  );
}
