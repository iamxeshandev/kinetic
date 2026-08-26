import { Typography } from '@mui/material';
import { Label } from '../../../components/ui';
import { checkOverdue } from '../../../utils/helpers';
import type { Project } from '../types/project.types';

export type ProjectHealthProps = {
  dueDate?: Project['dueDate'];
  isCompleted: boolean;
  variant?: 'label' | 'standard';
};

export function ProjectHealth({
  dueDate,
  isCompleted,
  variant = 'standard',
}: ProjectHealthProps) {
  const isAtRisk = checkOverdue(dueDate, 7);
  const isDelayed = !isAtRisk && checkOverdue(dueDate);

  const health = isCompleted
    ? 'Completed'
    : isAtRisk
      ? 'At Risk'
      : isDelayed
        ? 'Delayed'
        : 'On Track';

  const color = isCompleted
    ? 'info'
    : isAtRisk
      ? 'warning'
      : isDelayed
        ? 'error'
        : 'success';

  const renderStandard = () => (
    <Typography variant='overline2' color={color}>
      {health}
    </Typography>
  );

  const renderLabel = () => (
    <Label size='small' color={color}>
      {health}
    </Label>
  );

  return variant === 'label' ? renderLabel() : renderStandard();
}
