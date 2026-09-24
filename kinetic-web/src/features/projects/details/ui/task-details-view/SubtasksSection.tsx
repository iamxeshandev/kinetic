import {
  Button,
  Checkbox,
  CircularProgress,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { useParams } from 'react-router';
import type { SubtaskDto, TaskDto } from '../../../../../shared/api';
import { useBoolean } from '../../../../../shared/hooks';
import { AddIcon, SubtasksIcon, TrashIcon } from '../../../../../shared/icons';
import { toast } from '../../../../../shared/toast';
import { Centered, ConfirmDialog } from '../../../../../shared/ui';
import { SegmentedProgress } from '../../../../../shared/ui/SegmentedProgress';
import {
  useCreateSubtask,
  useDeleteSubtask,
  useUpdateSubtask,
} from '../../hooks';
import { SectionLabel } from './SectionLabel';

export type SubtaskSectionProps = {
  task: TaskDto;
};

export function SubtasksSection({ task }: SubtaskSectionProps) {
  const { workspaceId, projectId } = useParams();

  const createMode = useBoolean();

  const [editSubtask, setEditSubtask] = useState<SubtaskDto | null>(null);
  const [deleteSubtaskId, setDeleteSubtaskId] = useState<string | null>(null);

  const [newSubtaskName, setNewSubtaskName] = useState('');
  const [updatedSubtaskName, setUpdatedSubtaskName] = useState('');

  const { trigger: createSubtask, isMutating: isCreating } = useCreateSubtask(
    workspaceId!,
    projectId!,
    task.id,
  );

  const { trigger: updateSubtask, isMutating: isUpdating } = useUpdateSubtask(
    workspaceId!,
    projectId!,
    task.id,
  );

  const { trigger: deleteSubtask, isMutating: isDeleting } = useDeleteSubtask(
    workspaceId!,
    projectId!,
    task.id,
  );

  const cancelCreateSubtask = () => {
    createMode.setFalse();
    setNewSubtaskName('');
  };

  const handleCreateSubtask = async () => {
    const name = newSubtaskName.trim();
    if (!name) {
      cancelCreateSubtask();
      return;
    }

    await createSubtask({ name, previousSubtaskId: task.subtasks?.at(-1)?.id })
      .catch((err) => {
        toast.error(err.message);
        console.error(err);
      })
      .finally(() => cancelCreateSubtask());
  };

  const cancelUpdateSubtask = () => {
    setEditSubtask(null);
    setUpdatedSubtaskName('');
  };

  const handleUpdateSubtask = async () => {
    const name = updatedSubtaskName.trim();
    if (!name || !editSubtask || name === editSubtask.name) {
      cancelUpdateSubtask();
      return;
    }

    await updateSubtask({
      subtaskId: editSubtask.id,
      name,
    })
      .catch((err) => {
        toast.error(err.message);
        console.error(err);
      })
      .finally(() => cancelUpdateSubtask());
  };

  const handleToggleSubtaskCompletion = async (subtask: SubtaskDto) => {
    await updateSubtask({
      subtaskId: subtask.id,
      name: subtask.name,
      isCompleted: !subtask.completedAt,
    }).catch((err) => {
      toast.error(err.message);
      console.error(err);
    });
  };

  const handleDeleteSubtask = async () => {
    if (!deleteSubtaskId) return;

    await deleteSubtask({ subtaskId: deleteSubtaskId })
      .then(() => setDeleteSubtaskId(null))
      .catch((err) => {
        toast.error(err.message);
        console.error(err);
      });
  };

  const completedTaskCount =
    task.subtasks?.filter((subtask) => !!subtask.completedAt).length ?? 0;

  return (
    <>
      <Stack spacing={1}>
        <SectionLabel
          label={
            !task.subtasks?.length
              ? 'Subtasks'
              : `Subtasks (${completedTaskCount}/${task.subtasks.length})`
          }
          icon={SubtasksIcon}
        />

        {task.subtasks?.length && (
          <SegmentedProgress
            value={completedTaskCount}
            segments={task.subtasks.length}
            max={20}
          />
        )}

        <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {!task.subtasks?.length
            ? !createMode.value && (
                <Centered
                  sx={{
                    p: 2,
                    backgroundColor: 'background.neutral',
                    borderRadius: 2,
                  }}
                >
                  No subtasks
                </Centered>
              )
            : task.subtasks.map((subtask) => (
                <ListItem
                  key={subtask.id}
                  sx={{
                    backgroundColor: 'background.neutral',
                    borderRadius: 2,
                    '& .actions': {
                      display: 'none',
                    },
                    '&:hover': {
                      '.actions': {
                        display: 'flex',
                      },
                    },
                  }}
                >
                  {subtask.id === editSubtask?.id ? (
                    <TextField
                      key={subtask.id}
                      value={updatedSubtaskName}
                      onChange={(e) => setUpdatedSubtaskName(e.target.value)}
                      size='small'
                      fullWidth
                      autoFocus
                      disabled={isUpdating}
                      onBlur={isUpdating ? undefined : handleUpdateSubtask}
                      onKeyDown={async (e) => {
                        if (e.key === 'Escape') {
                          e.stopPropagation();
                          cancelUpdateSubtask();
                        }
                        if (e.key === 'Enter' && !e.shiftKey) {
                          await handleUpdateSubtask();
                        }
                      }}
                      slotProps={{
                        input: {
                          endAdornment: isUpdating ? (
                            <InputAdornment position='end'>
                              <CircularProgress size={20} />
                            </InputAdornment>
                          ) : undefined,
                        },
                      }}
                    />
                  ) : (
                    <>
                      <ListItemIcon>
                        <Checkbox
                          checked={!!subtask.completedAt}
                          onChange={() =>
                            handleToggleSubtaskCompletion(subtask)
                          }
                          disabled={isUpdating}
                          size='small'
                          sx={{ p: 0 }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        onClick={() => {
                          setUpdatedSubtaskName(subtask.name);
                          setEditSubtask(subtask);
                        }}
                        sx={{
                          textDecoration: subtask.completedAt
                            ? 'line-through'
                            : '',
                          color: subtask.completedAt ? 'text.disabled' : '',
                        }}
                      >
                        {subtask.name}
                      </ListItemText>
                      <ListItemSecondaryAction className='actions'>
                        <IconButton
                          size='small'
                          disabled={isDeleting}
                          color='error'
                          onClick={() => setDeleteSubtaskId(subtask.id)}
                        >
                          <TrashIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </>
                  )}
                </ListItem>
              ))}

          {createMode.value ? (
            <TextField
              value={newSubtaskName}
              onChange={(e) => setNewSubtaskName(e.target.value)}
              placeholder='New Subtask'
              size='small'
              fullWidth
              autoFocus
              multiline
              disabled={isCreating}
              onBlur={isCreating ? undefined : handleCreateSubtask}
              onKeyDown={async (e) => {
                if (e.key === 'Escape') {
                  e.stopPropagation();
                  cancelCreateSubtask();
                }
                if (e.key === 'Enter' && !e.shiftKey) {
                  await handleCreateSubtask();
                }
              }}
              slotProps={{
                input: {
                  endAdornment: isCreating ? (
                    <InputAdornment position='end'>
                      <CircularProgress size={20} />
                    </InputAdornment>
                  ) : undefined,
                },
              }}
            />
          ) : (
            <Button
              variant='text'
              startIcon={<AddIcon />}
              sx={{ alignSelf: 'center' }}
              onClick={createMode.setTrue}
            >
              Create Subtask
            </Button>
          )}
        </List>
      </Stack>

      <ConfirmDialog
        open={!!deleteSubtaskId}
        onClose={() => setDeleteSubtaskId(null)}
        title='Delete Subtask'
        content='Are you sure you want to delete this subtask?'
        action={
          <Button
            variant='contained'
            color='error'
            onClick={handleDeleteSubtask}
            loading={isDeleting}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}
