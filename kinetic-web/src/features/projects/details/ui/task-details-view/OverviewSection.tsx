import { Box, MenuItem, Select, Stack, TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import type { JSONContent } from '@tiptap/core';
import { useEffect, useState } from 'react';
import { LuCalendar, LuFlag, LuText, LuUser } from 'react-icons/lu';
import { useParams } from 'react-router';
import {
  type EPriority,
  type TaskDto,
  type TaskRequest,
} from '../../../../../shared/api';
import { priorityOptions } from '../../../../../shared/constants';
import { toast } from '../../../../../shared/toast';
import { useProjectMembers } from '../../../hooks';
import { useUpdateTask } from '../../hooks';
import { FieldLabel } from './FieldLabel';
import { GridFieldLabel } from './GridFieldLabel';

type TaskData = {
  name: string;
  description: JSONContent | null;
  priority: EPriority;
  dueDate: Date | null;
  assigneeId: string;
};

export type OverviewSectionProps = {
  open: boolean;
  task?: TaskDto;
};

export function OverviewSection({ open, task }: OverviewSectionProps) {
  const { workspaceId, projectId } = useParams();

  const { data: members = [] } = useProjectMembers(workspaceId!, projectId!);

  const { trigger: updateTask } = useUpdateTask(
    workspaceId!,
    projectId!,
    task?.id ?? '',
  );

  const [data, setData] = useState<TaskData>({
    name: '',
    description: null,
    priority: 'None',
    dueDate: null,
    assigneeId: '',
  });

  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData({
      name: task?.name ?? '',
      description: task?.description ?? null,
      priority: task?.priority ?? 'None',
      dueDate: task?.dueDate ? new Date(task.dueDate) : null,
      assigneeId: task?.assignee?.id
        ? (members.find((m) => m.id === task?.assignee?.id)?.id ?? '')
        : '',
    });
  }, [
    members,
    open,
    task?.assignee?.id,
    task?.description,
    task?.dueDate,
    task?.name,
    task?.priority,
  ]);

  const handleUpdate = (value: Record<string, unknown>) => {
    const fallback = data;
    const newData = { ...data, ...value };

    setData(newData);

    const payload: TaskRequest = {
      sectionId: task!.sectionId,
      name: newData.name,
      description: newData.description,
      priority: newData.priority,
      dueDate: newData.dueDate?.toISOString() ?? null,
      assigneeId: newData.assigneeId || null,
    };

    updateTask(payload).catch((err) => {
      toast.error(err.message);
      setData(fallback);
      console.error(err);
    });
  };

  return (
    <>
      <TextField
        label='Name'
        value={data.name}
        onChange={(e) => setData((prev) => ({ ...prev, name: e.target.value }))}
        required
      />

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
        <GridFieldLabel icon={LuFlag} label='Priority' />
        <Select
          value={data.priority}
          onChange={(e) => handleUpdate({ priority: e.target.value })}
          size='small'
          sx={{ backgroundColor: 'background.paper' }}
        >
          {priorityOptions.map(({ value, label }) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </Select>

        <GridFieldLabel icon={LuUser} label='Assignee' />
        <Select
          value={data.assigneeId}
          onChange={(e) => handleUpdate({ assigneeId: e.target.value })}
          size='small'
          sx={{ borderRadius: 4, backgroundColor: 'background.paper' }}
        >
          <MenuItem value=''>None</MenuItem>
          {members.map(({ id, firstName, lastName }) => (
            <MenuItem key={id} value={id}>
              {`${firstName} ${lastName}`}
            </MenuItem>
          ))}
        </Select>

        <GridFieldLabel icon={LuCalendar} label='Due Date' />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            value={data.dueDate}
            onChange={(newValue) => handleUpdate({ dueDate: newValue })}
            slotProps={{
              field: { clearable: true },
              textField: { size: 'small' },
            }}
            sx={{ backgroundColor: 'background.paper' }}
          />
        </LocalizationProvider>
      </Box>

      <Stack spacing={1}>
        <FieldLabel label='Description' icon={LuText} />
        <TextField name='description' sx={{ borderRadius: 2 }} />
      </Stack>
    </>
  );
}
