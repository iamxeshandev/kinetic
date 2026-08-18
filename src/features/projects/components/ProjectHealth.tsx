import { Typography } from '@mui/material';
import { checkOverdue } from '../../../utils/helpers';

export type ProjectHealthProps = {
  dueDate: string | Date;
  isCompleted: boolean;
};

export function ProjectHealth({ dueDate, isCompleted }: ProjectHealthProps) {
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

  return (
    <Typography variant='overline2' color={color}>
      {health}
    </Typography>
  );
}
