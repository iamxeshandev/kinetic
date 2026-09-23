import { zodResolver } from '@hookform/resolvers/zod';
import { Box, MenuItem, Stack, Typography } from '@mui/material';
import { type JSONContent } from '@tiptap/core';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import type { IconType } from 'react-icons/lib';
import { LuCalendar, LuFlag, LuText, LuUser } from 'react-icons/lu';
import { useParams } from 'react-router';
import z from 'zod';
import { type TaskDto } from '../../../../../shared/api';
import { zEPriority } from '../../../../../shared/api/zod.gen';
import { priorityOptions } from '../../../../../shared/constants';
import {
  Form,
  FormDatePicker,
  FormRichTextEditor,
  FormSelect,
  FormTextField,
} from '../../../../../shared/form';
import { toast } from '../../../../../shared/toast';
import { useProjectMembers } from '../../../hooks';
import { useUpdateTask } from '../../hooks';
import { SectionLabel } from './SectionLabel';

const taskFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Enter a task name.')
    .max(100, 'Task name cannot exceed 100 characters.'),
  description: z.custom<JSONContent>().nullable(),
  priority: zEPriority,
  dueDate: z.date().nullable(),
  assigneeId: z.uuid('Select a valid assignee.').or(z.literal('')),
});

type TaskForm = z.infer<typeof taskFormSchema>;

const defaultValues: TaskForm = {
  name: '',
  description: null,
  priority: 'None',
  dueDate: null,
  assigneeId: '',
};

export type OverviewSectionProps = {
  open: boolean;
  task: TaskDto;
};

export function OverviewSection({ open, task }: OverviewSectionProps) {
  const { workspaceId, projectId } = useParams();

  const { data: members = [] } = useProjectMembers(workspaceId!, projectId!);

  const { trigger: updateTask } = useUpdateTask(
    workspaceId!,
    projectId!,
    task?.id ?? '',
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

  const [priority, dueDate, assigneeId] = useWatch({
    control: methods.control,
    name: ['priority', 'dueDate', 'assigneeId'],
  });

  useEffect(() => {
    if (!open) return;
    methods.reset({
      name: task?.name ?? defaultValues.name,
      description: task?.description ?? defaultValues.description,
      priority: task?.priority ?? defaultValues.priority,
      dueDate: task?.dueDate ? new Date(task.dueDate) : defaultValues.dueDate,
      assigneeId:
        members.find((member) => member.id === task?.assignee?.id)?.id ??
        defaultValues.assigneeId,
    });
  }, [
    members,
    methods,
    open,
    task?.assignee?.id,
    task?.description,
    task?.dueDate,
    task?.name,
    task?.priority,
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
    }).catch((err) => {
      toast.error(err.message);
      console.error(err);
    });
  }, [assigneeId, dueDate, methods, priority, task, updateTask]);

  return (
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
        <CustomLabel icon={LuFlag} label='Priority' />
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

        <CustomLabel icon={LuUser} label='Assignee' />
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

        <CustomLabel icon={LuCalendar} label='Due Date' />
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
