import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormTextField } from '../../../shared/components/form';
import { toast } from '../../../shared/toast';
import type { Callback } from '../../../shared/types';
import { useCreateWorkspace, useUpdateWorkspace } from '../hooks';
import {
  WorkspaceFormSchema,
  type Workspace,
  type WorkspaceForm,
} from '../types';

const defaultValues: WorkspaceForm = {
  name: '',
};

export type WorkspaceFormProps = {
  open: boolean;
  onClose: Callback;
  onExited?: Callback;
  workspace?: Workspace;
};

export function WorkspaceForm({
  open,
  onClose,
  onExited,
  workspace,
}: WorkspaceFormProps) {
  const isNew = !workspace;

  const inputRef = useRef<HTMLInputElement>(null);

  const { trigger: create } = useCreateWorkspace();
  const { trigger: update } = useUpdateWorkspace();

  const methods = useForm({
    resolver: zodResolver(WorkspaceFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!open) return;
    methods.reset({
      name: workspace?.name ?? defaultValues.name,
    });

    const timeout = setTimeout(() => inputRef.current?.focus(), 0);
    return () => clearTimeout(timeout);
  }, [methods, open, workspace?.name]);

  const handleSubmit = (data: WorkspaceForm) =>
    isNew
      ? create(data)
          .then((res) => {
            toast.success(res.message);
            onClose();
          })
          .catch((err) => toast.error(err.message))
      : update({
          id: workspace!.id,
          ...data,
        })
          .then((res) => toast.success(res.message))
          .catch((err) => toast.error(err.message));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      onTransitionExited={onExited}
      fullWidth
      maxWidth='sm'
    >
      <Form methods={methods} onSubmit={handleSubmit}>
        <DialogTitle>
          {isNew ? 'Create Workspace' : 'Edit Workspace'}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ pt: 0.5 }}>
            <FormTextField
              name='name'
              label='Name'
              required
              inputRef={inputRef}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            type='submit'
            loading={methods.formState.isSubmitting}
            disabled={!methods.formState.isDirty}
          >
            {isNew ? 'Create' : 'Update'}
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
