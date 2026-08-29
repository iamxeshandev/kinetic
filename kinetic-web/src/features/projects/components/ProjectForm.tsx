import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { parseISO } from 'date-fns';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useParams } from 'react-router';
import {
  Form,
  FormAutocomplete,
  FormDatePicker,
  FormSelect,
  FormTextField,
} from '../../../shared/form';
import { toast } from '../../../shared/toast';
import type { Callback } from '../../../utils/types/callback.types';
import { useLookups } from '../../lookups/hooks';
import { usersApi } from '../../users/api';
import type { User } from '../../users/types';
import { useCreateProject, useUpdateProject } from '../hooks';
import { ProjectFormSchema, type Project, type ProjectForm } from '../types';

const defaultValues: ProjectForm = {
  name: '',
  description: '',
  status: 'Active',
  priority: 'None',
  isFavorite: false,
  dueDate: null,
  leads: [],
  members: [],
};

export type ProjectFormProps = {
  open: boolean;
  onClose: Callback;
  onExited: Callback;
  project?: Project;
};

export function ProjectForm({
  open,
  onClose,
  onExited,
  project,
}: ProjectFormProps) {
  const isNew = project === undefined;

  const { workspaceId } = useParams();
  const { trigger: createProject } = useCreateProject(workspaceId!);
  const { trigger: updateProject } = useUpdateProject(workspaceId!);

  const { data: statuses } = useLookups('project-statuses');
  const { data: priorities } = useLookups('priorities');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const methods = useForm({
    resolver: zodResolver(ProjectFormSchema),
    defaultValues,
  });

  const leads =
    project?.team
      .filter((pm) => pm.role === 'Lead')
      .map((pm) => ({ id: pm.id, label: pm.fullName })) ?? defaultValues.leads;

  const members =
    project?.team
      .filter((pm) => pm.role === 'Member')
      .map((pm) => ({ id: pm.id, label: pm.fullName })) ??
    defaultValues.members;

  const watchedLeads = useWatch({
    control: methods.control,
    name: 'leads',
    defaultValue: leads,
  });
  const watchedMembers = useWatch({
    control: methods.control,
    name: 'members',
    defaultValue: members,
  });

  // * Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      usersApi
        .getAll(workspaceId!)
        .then((res) => setUsers((prev) => (res.data ? res.data : prev)))
        .catch((err) => console.error(err))
        .finally(() => setIsLoading(false));
    };

    if (open) fetchUsers();
  }, [open, workspaceId]);

  useEffect(() => {
    if (open)
      methods.reset({
        ...(project ?? defaultValues),
        // * Parse ISO string to Date object
        dueDate: project?.dueDate
          ? parseISO(project.dueDate.toString())
          : defaultValues.dueDate,
        leads,
        members,
      });
  }, [leads, members, methods, open, project]);

  const leadOptions = users
    .filter((u) => !(watchedMembers ?? []).map((m) => m.id).includes(u.id))
    .map((u) => ({ id: u.id, label: u.fullName }));

  const memberOptions = users
    .filter((u) => !(watchedLeads ?? []).map((m) => m.id).includes(u.id))
    .map((u) => ({ id: u.id, label: u.fullName }));

  const handleSubmit = (data: ProjectForm) =>
    isNew
      ? createProject(data)
          .then((res) => {
            toast.success(res.message);
            onClose();
          })
          .catch((err) => toast.error(err.response?.message))
      : updateProject({ ...project, ...data })
          .then((res) => toast.success(res.message))
          .catch((err) => toast.error(err.response?.message));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='sm'
      onTransitionExited={onExited}
    >
      <Form methods={methods} onSubmit={handleSubmit}>
        <DialogTitle>{isNew ? 'Create Project' : 'Edit Project'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <FormTextField name='name' label='Project Name' required />

            <FormTextField name='description' label='Description' />

            <Stack direction={'row'} spacing={2}>
              <FormSelect name='status' label='Status' required>
                {statuses.map(({ value, label }) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </FormSelect>

              <FormSelect name='priority' label='Priority' required>
                {priorities.map(({ value, label }) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </FormSelect>
            </Stack>

            <FormDatePicker name='dueDate' label='Due Date' />

            <Divider>
              <Typography variant='subtitle2'>Project Team</Typography>
            </Divider>

            <FormAutocomplete
              name='leads'
              label='Leads'
              multiple
              options={leadOptions}
              isOptionEqualToValue={(opt, val) => opt.id === val.id}
              filterSelectedOptions
              disableCloseOnSelect
              loading={isLoading}
            />

            <FormAutocomplete
              name='members'
              label='Members'
              multiple
              options={memberOptions}
              isOptionEqualToValue={(opt, val) => opt.id === val.id}
              filterSelectedOptions
              disableCloseOnSelect
              loading={isLoading}
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
