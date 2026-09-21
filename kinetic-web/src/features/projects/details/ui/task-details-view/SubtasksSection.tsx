import {
  Button,
  Checkbox,
  CircularProgress,
  IconButton,
  InputAdornment,
  LinearProgress,
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
import {
  useCreateSubtask,
  useDeleteSubtask,
  useUpdateSubtask,
} from '../../hooks';
import { FieldLabel } from './FieldLabel';

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
    await createSubtask({ name, isCompleted: false })
      .then((res) => {
        toast.success(res.message);
        cancelCreateSubtask();
      })
      .catch((err) => toast.error(err.message));
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
      isCompleted: editSubtask.isCompleted,
    })
      .then(() => cancelUpdateSubtask())
      .catch((err) => toast.error(err.message));
  };

  const handleToggleSubtaskCompletion = async (subtask: SubtaskDto) => {
    await updateSubtask({
      subtaskId: subtask.id,
      name: subtask.name,
      isCompleted: !subtask.isCompleted,
    })
      .then((res) => {
        toast.success(res.message);
      })
      .catch((err) => toast.error(err.message));
  };

  const handleDeleteSubtask = async () => {
    if (!deleteSubtaskId) return;
    await deleteSubtask({ subtaskId: deleteSubtaskId })
      .then((res) => {
        toast.success(res.message);
        setDeleteSubtaskId(null);
      })
      .catch((err) => toast.error(err.message));
  };

  return (
    <>
      <Stack spacing={1}>
        <FieldLabel
          label='Subtasks'
          icon={SubtasksIcon}
          action={
            <Button
              variant='text'
              size='small'
              startIcon={<AddIcon />}
              onClick={createMode.setTrue}
            >
              Add Subtask
            </Button>
          }
        />

        <LinearProgress variant='determinate' value={60} max={100} />

        <List
          disablePadding
          sx={{
            p: 1,
            backgroundColor: 'background.neutral',
            borderRadius: 2,
          }}
        >
          {createMode.value && (
            <ListItem>
              {/* <ListItemIcon /> */}
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
            </ListItem>
          )}

          {task.subtasks?.length
            ? task.subtasks.map((subtask) => (
                <ListItem
                  key={subtask.id}
                  sx={{
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
                          checked={subtask.isCompleted}
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
                          textDecoration: subtask.isCompleted
                            ? 'line-through'
                            : '',
                          color: subtask.isCompleted ? 'text.disabled' : '',
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
              ))
            : !createMode.value && (
                <Centered sx={{ height: 50 }}>No subtasks</Centered>
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
