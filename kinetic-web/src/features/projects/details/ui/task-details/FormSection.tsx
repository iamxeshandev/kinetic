import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, MenuItem, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  LuCalendar,
  LuCircleDot,
  LuFlag,
  LuText,
  LuUser,
} from 'react-icons/lu';
import { useParams } from 'react-router';
import {
  Form,
  FormDatePicker,
  FormRichTextEditor,
  FormSelect,
  FormTextField,
} from '../../../../../shared/components/form';
import { CancelIcon, CheckIcon } from '../../../../../shared/components/icons';
import { toast } from '../../../../../shared/toast';
import { useLookups } from '../../../../lookups/hooks';
import { sectionsApi } from '../../api';
import { useUpdateTask } from '../../hooks';
import {
  TaskFormSchema,
  type Section,
  type Task,
  type TaskForm,
} from '../../types';
import { FieldLabel } from './FieldLabel';
import { GridFieldLabel } from './GridFieldLabel';

const defaultValues: TaskForm = {
  sectionId: '',
  name: '',
  description: '',
  priority: '',
  dueDate: undefined,
  assigneeId: '',
};

export function FormSection({ open, task }: { open: boolean; task: Task }) {
  const { workspaceId, projectId } = useParams();

  const { data: priorities = [] } = useLookups('priorities');

  const [sections, setSections] = useState<Section[]>([]);

  const { trigger: update } = useUpdateTask(workspaceId!, projectId!);

  const methods = useForm<TaskForm>({
    resolver: zodResolver(TaskFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!open) return;
    const fetchSections = () =>
      sectionsApi
        .getAll(workspaceId!, projectId!)
        .then((res) => setSections(res.data ?? []))
        .catch((err) => console.error(err));

    fetchSections();
  }, [open, projectId, workspaceId]);

  useEffect(() => {
    if (!open) return;
    methods.reset({
      sectionId: task.sectionId,
      name: task.name,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      assigneeId: task.assignee?.id ?? '',
    });
  }, [methods, open, sections, task]);

  const handleSubmit = (data: TaskForm) =>
    update({ ...task, ...data })
      .then((res) => toast.success(res.message))
      .catch((err) => toast.error(err.message));

  console.log(methods.formState.isDirty);

  return (
    <Form
      onSubmit={handleSubmit}
      methods={methods}
      sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
    >
      <FormTextField name='name' label='Name' required />

      <Box
        sx={{
          p: 2,
          border: 1,
          borderRadius: 2,
          borderColor: 'divider',
          backgroundColor: 'surface.subtle',
          display: 'grid',
          gridTemplateColumns: '100px auto',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <GridFieldLabel icon={LuCircleDot} label='Section' />
        <FormSelect
          name='sectionId'
          size='small'
          sx={{ backgroundColor: 'background.paper' }}
        >
          {sections.map(({ id, name }) => (
            <MenuItem key={id} value={id}>
              {name}
            </MenuItem>
          ))}
        </FormSelect>

        <GridFieldLabel icon={LuFlag} label='Priority' />
        <FormSelect
          name='priority'
          size='small'
          sx={{ backgroundColor: 'background.paper' }}
        >
          {priorities.map(({ value, label }) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </FormSelect>

        <GridFieldLabel icon={LuUser} label='Assignee' />
        <FormSelect
          name='assigneeId'
          size='small'
          sx={{ borderRadius: 4, backgroundColor: 'background.paper' }}
        >
          <MenuItem value=''>High</MenuItem>
        </FormSelect>

        <GridFieldLabel icon={LuCalendar} label='Due Date' />
        <FormDatePicker
          name='dueDate'
          slotProps={{
            textField: {
              size: 'small',
            },
          }}
          sx={{
            backgroundColor: 'background.paper',
          }}
        />
      </Box>

      <Stack spacing={1}>
        <FieldLabel label='Description' icon={LuText} />
        <FormRichTextEditor name='description' sx={{ borderRadius: 2 }} />
      </Stack>

      <Box
        sx={{
          position: 'absolute',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          p: 2,
          border: 1,
          borderColor: 'divider',
          borderRadius: 4,
          backgroundColor: 'background.paper',
          display: methods.formState.isDirty ? 'flex' : 'none',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Button
          color='error'
          variant='outlined'
          startIcon={<CancelIcon />}
          sx={{ borderRadius: 4 }}
          onClick={() => methods.reset()}
        >
          Cancel
        </Button>
        <Button
          type='submit'
          color='success'
          startIcon={<CheckIcon />}
          sx={{ borderRadius: 4 }}
        >
          Save Changes
        </Button>
      </Box>
    </Form>
  );
}
