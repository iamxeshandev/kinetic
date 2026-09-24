import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  type DialogProps,
} from '@mui/material';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useParams } from 'react-router';
import z from 'zod';
import type { TaskTypeDto } from '../../../../../shared/api';
import { Form, FormTextField } from '../../../../../shared/form';
import { toast } from '../../../../../shared/toast';
import { useCreateTaskType, useUpdateTaskType } from '../../hooks';

const createTaskTypeSchema = (taskTypes: TaskTypeDto[]) =>
  z
    .object({
      name: z
        .string()
        .min(1, 'Enter a task type name.')
        .max(50, 'Name cannot exceed 50 characters.'),
      code: z
        .string()
        .min(1, 'Enter a task type code.')
        .min(2, 'Code must be at least 3 characters.')
        .max(5, 'Code cannot exceed 5 characters.'),
    })
    .superRefine(({ name, code }, ctx) => {
      const nameExists = taskTypes.some(
        (taskType) => taskType.name.toLowerCase() === name.toLowerCase(),
      );
      if (nameExists)
        ctx.addIssue({
          code: 'custom',
          path: ['name'],
          message: 'Task type name already exists.',
        });

      const codeExists = taskTypes.some(
        (taskType) => taskType.code.toLowerCase() === code.toLowerCase(),
      );
      if (codeExists)
        ctx.addIssue({
          code: 'custom',
          path: ['code'],
          message: 'Task type code already exists.',
        });
    });

type TaskTypeForm = z.infer<ReturnType<typeof createTaskTypeSchema>>;

const defaultValues: TaskTypeForm = {
  name: '',
  code: '',
};

type TaskTypeDialogProps = DialogProps & {
  taskType?: TaskTypeDto;
  taskTypes: TaskTypeDto[];
};

export function TaskTypeDialog({
  taskType,
  taskTypes,
  open,
  onClose,
  ...props
}: TaskTypeDialogProps) {
  const { workspaceId = '', projectId = '' } = useParams();

  const isNew = !taskType;

  const { trigger: createTaskType, isMutating: isCreating } = useCreateTaskType(
    workspaceId,
    projectId,
  );
  const { trigger: updateTaskType, isMutating: isUpdating } = useUpdateTaskType(
    workspaceId,
    projectId,
  );

  const methods = useForm({
    resolver: zodResolver(createTaskTypeSchema(taskTypes)),
    defaultValues,
  });

  const code = useWatch({
    control: methods.control,
    name: 'code',
  });

  useEffect(() => {
    methods.setValue('code', code.toUpperCase());
  }, [code, methods]);

  useEffect(() => {
    if (!open) return;
    methods.reset({
      name: taskType?.name ?? defaultValues.name,
      code: taskType?.code ?? defaultValues.code,
    });
  }, [methods, open, taskType?.code, taskType?.name]);

  const onSubmit = (data: TaskTypeForm) =>
    isNew
      ? createTaskType(data)
          .then((res) => {
            toast.success(res.message);
            onClose?.({}, 'backdropClick');
          })
          .catch((err) => {
            toast.error(err.message);
            console.error(err);
          })
      : updateTaskType({
          taskTypeId: taskType.id,
          ...data,
        })
          .then((res) => {
            toast.success(res.message);
          })
          .catch((err) => {
            toast.error(err.message);
            console.error(err);
          });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='xs' {...props}>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>
          {isNew ? 'Create Task Type' : 'Edit Task Type'}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormTextField
              name='name'
              label='Name'
              placeholder='2 to 50 characters'
            />
            <FormTextField
              name='code'
              label='Code'
              placeholder='2 to 5 characters'
              slotProps={{
                htmlInput: {
                  maxLength: 5,
                },
              }}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            type='submit'
            color='primary'
            loading={isNew ? isCreating : isUpdating}
            disabled={!methods.formState.isDirty}
          >
            {isNew ? 'Create' : 'Update'}
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
