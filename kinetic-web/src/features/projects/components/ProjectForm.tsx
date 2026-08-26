import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
} from '@mui/material';
import { parseISO } from 'date-fns';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import {
  Form,
  FormDatePicker,
  FormSelect,
  FormTextField,
} from '../../../components/form';
import { toast } from '../../../components/toast';
import type { Callback } from '../../../utils/types/callback.types';
import { useCreateProject, useUpdateProject } from '../hooks/useProjects';
import {
  ProjectFormSchema,
  ProjectPrioritySchema,
  ProjectStatusSchema,
  type Project,
  type ProjectForm,
} from '../types/project.types';

const defaultValues: ProjectForm = {
  name: '',
  description: '',
  status: 'Active',
  priority: 'None',
  isFavorite: false,
  dueDate: null,
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

  const methods = useForm({
    resolver: zodResolver(ProjectFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (open)
      methods.reset({
        ...(project ?? defaultValues),
        dueDate: project?.dueDate
          ? parseISO(project.dueDate.toString())
          : defaultValues.dueDate,
      });
  }, [methods, open, project]);

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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <FormTextField name='name' label='Project Name' required />
            <FormTextField name='description' label='Description' />
            <FormSelect name='status' label='Status'>
              {ProjectStatusSchema.options.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </FormSelect>
            <FormSelect name='priority' label='Priority'>
              {ProjectPrioritySchema.options.map((priority) => (
                <MenuItem key={priority} value={priority}>
                  {priority}
                </MenuItem>
              ))}
            </FormSelect>
            <FormDatePicker name='dueDate' label='Due Date' />
          </Box>
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
