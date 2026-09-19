import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
} from '@mui/material';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import z from 'zod';
import type { UserDto } from '../../../shared/api';
import { zEWorkspaceRole } from '../../../shared/api/zod.gen';
import { Form, FormSelect, FormTextField } from '../../../shared/form';
import { toast } from '../../../shared/toast';
import { workspaceRoleOptions } from '../../workspaces/constants';
import { useCreateUser, useUpdateUser } from '../hooks';

const userFormSchema = z.object({
  email: z.email('Enter a valid email address.'),
  role: zEWorkspaceRole,
});

type UserForm = z.infer<typeof userFormSchema>;

const defaultValues: UserForm = {
  email: '',
  role: 'Member',
};

export type UserFormProps = {
  open: boolean;
  onClose: VoidFunction;
  user?: UserDto;
};

export function UserForm({ open, onClose, user }: UserFormProps) {
  const isNew = !user;

  const { workspaceId } = useParams();

  const { trigger: createUser } = useCreateUser(workspaceId!);
  const { trigger: updateUser } = useUpdateUser(workspaceId!, user?.id ?? '');

  const methods = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!open) return;
    methods.reset({
      email: user?.email ?? defaultValues.email,
      role: user?.role ?? defaultValues.role,
    });
  }, [methods, open, user?.email, user?.firstName, user?.lastName, user?.role]);

  const handleSubmit = (data: UserForm) =>
    isNew
      ? createUser(data)
          .then((res) => {
            toast.success(res.message);
            onClose();
          })
          .catch((err) => toast.error(err.message))
      : updateUser(data)
          .then((res) => toast.success(res.message))
          .catch((err) => toast.error(err.message));

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
      <Form methods={methods} onSubmit={handleSubmit}>
        <DialogTitle>{isNew ? 'Create User' : 'Edit User'}</DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <FormTextField
              name='email'
              label='Email'
              required
              disabled={!isNew}
            />

            <FormSelect name='role' label='Role' required>
              {workspaceRoleOptions.map(({ value, label }) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </FormSelect>
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
