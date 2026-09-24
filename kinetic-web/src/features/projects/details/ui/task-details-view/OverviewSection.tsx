import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { type JSONContent } from '@tiptap/core';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import type { IconType } from 'react-icons/lib';
import { LuText } from 'react-icons/lu';
import { useParams } from 'react-router';
import z from 'zod';
import { type TaskDto, type TaskTypeDto } from '../../../../../shared/api';
import { zEPriority } from '../../../../../shared/api/zod.gen';
import { priorityOptions } from '../../../../../shared/constants';
import {
  Form,
  FormAutocomplete,
  FormDatePicker,
  FormRichTextEditor,
  FormSelect,
  FormTextField,
} from '../../../../../shared/form';
import { useBoolean } from '../../../../../shared/hooks';
import {
  AddIcon,
  CalendarIcon,
  FlagIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
} from '../../../../../shared/icons';
import { toast } from '../../../../../shared/toast';
import { ConfirmDialog } from '../../../../../shared/ui';
import { useProjectMembers } from '../../../hooks';
import { useDeleteTaskType, useTaskTypes, useUpdateTask } from '../../hooks';
import { SectionLabel } from './SectionLabel';
import { TaskTypeDialog } from './TaskTypeDialog';

const CREATE_TASK_TYPE = {
  id: '__create__',
  name: 'Create',
  code: '',
};

const taskFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Enter a task name.')
    .max(100, 'Task name cannot exceed 100 characters.'),
  description: z.custom<JSONContent>().nullable(),
  priority: zEPriority,
  dueDate: z.date().nullable(),
  assigneeId: z.uuid('Select a valid assignee.').or(z.literal('')),
  taskTypeId: z.uuid('Select a valid task type.').nullable(),
  taskLabelIds: z.array(z.uuid('Select a valid task label.')).or(z.literal([])),
});

type TaskForm = z.infer<typeof taskFormSchema>;

const defaultValues: TaskForm = {
  name: '',
  description: null,
  priority: 'None',
  dueDate: null,
  assigneeId: '',
  taskTypeId: null,
  taskLabelIds: [],
};

export type OverviewSectionProps = {
  task: TaskDto;
};

export function OverviewSection({ task }: OverviewSectionProps) {
  const { workspaceId = '', projectId = '' } = useParams();

  const taskTypeForm = useBoolean();
  const confirmDialog = useBoolean();
  const [selectedTaskType, setSelectedTaskType] = useState<TaskTypeDto>();

  const { data: taskTypes = [] } = useTaskTypes(workspaceId, projectId);
  const { data: members = [] } = useProjectMembers(workspaceId, projectId);

  const { trigger: updateTask } = useUpdateTask(
    workspaceId!,
    projectId!,
    task?.id ?? '',
  );

  const { trigger: deleteTaskType, isMutating: isDeleting } = useDeleteTaskType(
    workspaceId,
    projectId,
  );

  const methods = useForm<TaskForm>({
    mode: 'all',
    resolver: zodResolver(taskFormSchema),
    defaultValues,
  });

  const { isDirty, isValid } = methods.formState;

  const [name, description] = useWatch({
    control: methods.control,
    name: ['name', 'description'],
  });

  const [priority, dueDate, assigneeId, taskTypeId] = useWatch({
    control: methods.control,
    name: ['priority', 'dueDate', 'assigneeId', 'taskTypeId'],
  });

  useEffect(() => {
    methods.reset({
      name: task.name ?? defaultValues.name,
      description: task.description ?? defaultValues.description,
      priority: task.priority ?? defaultValues.priority,
      dueDate: task.dueDate ? new Date(task.dueDate) : defaultValues.dueDate,
      assigneeId:
        members.find((member) => member.id === task.assignee?.id)?.id ??
        defaultValues.assigneeId,
      taskTypeId: task.taskType?.id ?? defaultValues.taskTypeId,
      taskLabelIds: task.taskLabels?.map((taskLabel) => taskLabel.id) ?? [],
    });
  }, [
    members,
    methods,
    task.assignee?.id,
    task.description,
    task.dueDate,
    task.name,
    task.priority,
    task.taskLabels,
    task.taskType?.id,
  ]);

  // Debounce updates
  useEffect(() => {
    if (!isDirty || !isValid) return;

    const timer = setTimeout(() => {
      updateTask({
        sectionId: task.sectionId,
        name,
        description: description || null,
        priority: methods.getValues('priority') ?? 'None',
        dueDate: methods.getValues('dueDate')?.toISOString(),
        assigneeId: methods.getValues('assigneeId'),
      }).catch((err) => {
        toast.error(err.message);
        console.error(err);
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [description, isDirty, isValid, methods, name, task, updateTask]);

  // Immediate updates
  useEffect(() => {
    if (!methods.formState.isDirty || !methods.formState.isValid) return;

    updateTask({
      sectionId: task.sectionId,
      name: methods.getValues('name') ?? '',
      description: methods.getValues('description') || null,
      priority,
      dueDate: dueDate?.toISOString(),
      assigneeId,
      taskTypeId,
    }).catch((err) => {
      toast.error(err.message);
      console.error(err);
    });
  }, [assigneeId, dueDate, methods, priority, task, taskTypeId, updateTask]);

  const handleDeleteTaskType = () =>
    deleteTaskType(selectedTaskType?.id ?? '')
      .then((res) => {
        toast.success(res.message);
        confirmDialog.setFalse();
      })
      .catch((err) => {
        toast.error(err.message);
        console.error(err);
      });

  return (
    <>
      <Form
        methods={methods}
        sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
      >
        <FormTextField name='name' label='Name' multiline required />

        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: 'background.neutral',
            display: 'grid',
            gridTemplateColumns: '120px auto',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <CustomLabel icon={FlagIcon} label='Type' />
          <FormAutocomplete
            name='taskTypeId'
            size='small'
            options={[...taskTypes, CREATE_TASK_TYPE]}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            sx={{ backgroundColor: 'background.default' }}
            renderOption={({ key, ...props }, option) =>
              option.id === CREATE_TASK_TYPE.id ? (
                <ListItem
                  key={key}
                  {...props}
                  onClick={() => {
                    setSelectedTaskType(undefined);
                    taskTypeForm.setTrue();
                  }}
                  sx={{ color: 'primary.main' }}
                >
                  <ListItemIcon sx={{ color: 'inherit' }}>
                    <AddIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={option.name}
                    slotProps={{
                      primary: {
                        variant: 'button',
                        color: 'inherit',
                      },
                    }}
                  />
                </ListItem>
              ) : (
                <ListItem key={key} {...props}>
                  <ListItemText primary={option.name} />

                  <ListItemSecondaryAction onClick={(e) => e.stopPropagation()}>
                    <IconButton
                      size='small'
                      onClick={() => {
                        setSelectedTaskType(option);
                        taskTypeForm.setTrue();
                      }}
                    >
                      <PencilIcon />
                    </IconButton>

                    <IconButton
                      size='small'
                      color='error'
                      onClick={() => {
                        setSelectedTaskType(option);
                        confirmDialog.setTrue();
                      }}
                    >
                      <TrashIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              )
            }
          />

          <CustomLabel icon={FlagIcon} label='Priority' />
          <FormSelect
            name='priority'
            size='small'
            sx={{ backgroundColor: 'background.default' }}
          >
            {priorityOptions.map(({ value, label }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </FormSelect>

          <CustomLabel icon={UserIcon} label='Assignee' />
          <FormSelect
            name='assigneeId'
            size='small'
            sx={{ backgroundColor: 'background.default' }}
          >
            <MenuItem value=''>None</MenuItem>
            {members.map(({ id, firstName, lastName }) => (
              <MenuItem key={id} value={id}>
                {`${firstName} ${lastName}`}
              </MenuItem>
            ))}
          </FormSelect>

          <CustomLabel icon={CalendarIcon} label='Due Date' />
          <FormDatePicker
            name='dueDate'
            slotProps={{
              field: { clearable: true },
              textField: { size: 'small' },
            }}
            sx={{ backgroundColor: 'background.default' }}
          />
        </Box>

        <Stack spacing={1}>
          <SectionLabel label='Description' icon={LuText} />
          <FormRichTextEditor name='description' />
        </Stack>
      </Form>

      <TaskTypeDialog
        open={taskTypeForm.value}
        onClose={() => taskTypeForm.setFalse()}
        onTransitionExited={() => setSelectedTaskType(undefined)}
        taskType={selectedTaskType}
        taskTypes={taskTypes}
      />

      <ConfirmDialog
        open={confirmDialog.value}
        onClose={() => confirmDialog.setFalse()}
        onTransitionExited={() => setSelectedTaskType(undefined)}
        title='Delete Task Type'
        content={`Are you sure you want to delete the task type "${selectedTaskType?.name}"?`}
        action={
          <Button
            variant='contained'
            color='error'
            onClick={handleDeleteTaskType}
            loading={isDeleting}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

const CustomLabel = ({
  icon: Icon,
  label,
}: {
  icon: IconType;
  label: string;
}) => (
  <Typography
    color='textSecondary'
    variant='subtitle1'
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1,
    }}
  >
    <Icon strokeWidth={2} />
    {label}
  </Typography>
);
