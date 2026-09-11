import { move } from '@dnd-kit/helpers';
import { DragDropProvider } from '@dnd-kit/react';
import { Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { TrashIcon } from '../../../../../shared/components/icons/index.js';
import { ActionMenu } from '../../../../../shared/components/ui/ActionMenu.js';
import { useBoolean } from '../../../../../shared/hooks/useBoolean.js';
import { useSections } from '../../hooks/useSections.js';
import { useTasks } from '../../hooks/useTasks.js';
import type { Section, Task } from '../../types/index.js';
import { TaskDetails } from '../task-details/TaskDetails.js';
import { CreateSectionButton } from './CreateSectionButton.js';
import { DeleteSectionDialog } from './DeleteSectionDialog.js';
import { SortableSection } from './SortableSection.js';
import { SortableTask } from './SortableTask.js';

export default function KanbanView() {
  const { workspaceId, projectId } = useParams();

  const { data: sections = [] } = useSections(workspaceId!, projectId!);
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
    const syncItems = () =>
      setItems(
        sections.reduce(
          (acc, section) => {
            acc[section.id] = tasks
              .filter((task) => task.sectionId === section.id)
              .map((task) => task.id);
            return acc;
          },
          {} as Record<Section['id'], Task['id'][]>,
        ),
      );

    syncItems();
  }, [sections, tasks]);

  const onEditTask = (
    event: React.MouseEvent<HTMLDivElement>,
    taskId: Task['id'],
  ) => {
    event.currentTarget.blur();
    setTaskId(taskId);
    taskDetails.setTrue();
  };

  return (
    <>
      <DragDropProvider
        onDragOver={(event) => {
          const { source } = event.operation;
          if (source?.type === 'column') return;
          setItems((items) => move(items, event));
        }}
      >
        <Stack direction='row' spacing={2} sx={{ p: 0.5, flex: 1 }}>
          {Object.entries(items).map(([sectionId, taskIds], index) => (
            <SortableSection
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
                <SortableTask
                  key={taskId}
                  index={index}
                  id={taskId}
                  sectionId={sectionId}
                  task={tasksMap[taskId]}
                  onEditTask={onEditTask}
                />
              ))}
            </SortableSection>
          ))}

          <CreateSectionButton />
        </Stack>
      </DragDropProvider>

      <TaskDetails
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
