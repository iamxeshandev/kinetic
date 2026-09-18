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
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useParams } from 'react-router';
import z from 'zod';
import { getUsers, type ProjectDto, type UserDto } from '../../../shared/api';
import { zEPriority, zEProjectStatus } from '../../../shared/api/zod.gen';
import {
  Form,
  FormAutocomplete,
  FormDatePicker,
  FormSelect,
  FormTextField,
} from '../../../shared/form';
import { toast } from '../../../shared/toast';
import { priorityOptions } from '../../../shared/types';
import { projectStatusOptions } from '../constants/project-status';
import { useCreateProject, useUpdateProject } from '../hooks';

const projectFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Enter project name.')
    .max(100, 'Project name cannot exceed 100 characters.'),
  description: z
    .string()
    .max(1000, 'Description cannot exceed 1000 characters.'),
  status: zEProjectStatus,
  priority: zEPriority,
  dueDate: z.date().nullable(),
  leadIds: z.array(z.uuid()),
  memberIds: z.array(z.uuid()),
});

type ProjectForm = z.infer<typeof projectFormSchema>;

const defaultValues: ProjectForm = {
  name: '',
  description: '',
  status: 'Active',
  priority: 'None',
  dueDate: null,
  leadIds: [],
  memberIds: [],
};

export type ProjectFormProps = {
  open: boolean;
  onClose: () => void;
  project?: ProjectDto;
};

export function ProjectForm({ open, onClose, project }: ProjectFormProps) {
  const isNew = !project;

  const { workspaceId } = useParams();

  const { trigger: createProject } = useCreateProject(workspaceId!);
  const { trigger: updateProject } = useUpdateProject(
    workspaceId!,
    project?.id ?? '',
  );

  const [users, setUsers] = useState<UserDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<ProjectForm>({
    resolver: zodResolver(projectFormSchema),
    defaultValues,
  });

  const initialLeadIds =
    project?.team?.filter((pm) => pm.role === 'Lead').map((pm) => pm.id) ??
    defaultValues.leadIds;

  const initialMemberIds =
    project?.team?.filter((pm) => pm.role === 'Member').map((pm) => pm.id) ??
    defaultValues.memberIds;

  const watchedLeadIds = useWatch({
    control: methods.control,
    name: 'leadIds',
    defaultValue: initialLeadIds,
  });

  const watchedMemberIds = useWatch({
    control: methods.control,
    name: 'memberIds',
    defaultValue: initialMemberIds,
  });

  // * Fetch users on dialog open
  useEffect(() => {
    if (!open) return;
    const fetchUsers = () => {
      setIsLoading(true);
      getUsers({ path: { workspaceId: workspaceId! } })
        .then((res) => setUsers(res.data.data ?? []))
        .catch((err) => console.error(err))
        .finally(() => setIsLoading(false));
    };
    fetchUsers();
  }, [open, workspaceId]);

  // * Reset form when project changes or dialog opens
  useEffect(() => {
    if (!open) return;
    methods.reset({
      name: project?.name ?? defaultValues.name,
      description: project?.description ?? defaultValues.description,
      status: project?.status ?? defaultValues.status,
      priority: project?.priority ?? defaultValues.priority,
      dueDate: project?.dueDate
        ? new Date(project.dueDate)
        : defaultValues.dueDate,
      leadIds: initialLeadIds,
      memberIds: initialMemberIds,
    });
  }, [open, project, initialLeadIds, initialMemberIds, methods]);

  const selectedLeadIds = new Set(watchedLeadIds);
  const selectedMemberIds = new Set(watchedMemberIds);

  const leadOptions = users
    .filter((u) => !selectedMemberIds.has(u.id))
    .map((u) => ({ id: u.id, firstName: u.firstName, lastName: u.lastName }));
  const memberOptions = users
    .filter((u) => !selectedLeadIds.has(u.id))
    .map((u) => ({ id: u.id, firstName: u.firstName, lastName: u.lastName }));

  const handleSubmit = async (data: ProjectForm) =>
    isNew
      ? createProject({ ...data, dueDate: data.dueDate?.toISOString() ?? null })
          .then((res) => {
            toast.success(res.message);
            onClose();
          })
          .catch((err) => toast.error(err.message))
      : updateProject({ ...data, dueDate: data.dueDate?.toISOString() ?? null })
          .then((res) => toast.success(res.message))
          .catch((err) => toast.error(err.message));

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
      <Form methods={methods} onSubmit={handleSubmit}>
        <DialogTitle>{isNew ? 'Create Project' : 'Edit Project'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <FormTextField name='name' label='Project Name' required />

            <FormTextField name='description' label='Description' />

            <Stack direction='row' spacing={2}>
              <FormSelect name='status' label='Status' required>
                {projectStatusOptions.map(({ value, label }) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </FormSelect>

              <FormSelect name='priority' label='Priority' required>
                {priorityOptions.map(({ value, label }) => (
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
              getOptionLabel={(opt) => `${opt.firstName} ${opt.lastName}`}
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
              getOptionLabel={(opt) => `${opt.firstName} ${opt.lastName}`}
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
