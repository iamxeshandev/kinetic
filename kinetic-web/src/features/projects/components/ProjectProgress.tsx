import { Box, LinearProgress, Typography, type BoxProps } from '@mui/material';

export type ProjectProgressProps = BoxProps & {
  value: number;
  max: number;
  showPercentage?: boolean;
};

export function ProjectProgress({
  value,
  max,
  showPercentage = false,
  ...props
}: ProjectProgressProps) {
  const percentage = Number(((value / max) * 100).toFixed());

  const color =
    percentage >= 100
      ? 'success'
      : percentage >= 50
        ? 'info'
        : percentage > 0
          ? 'warning'
          : 'error';

  return (
    <Box {...props}>
      {showPercentage && (
        <Typography
          variant='caption'
          color='textSecondary'
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <span>{percentage}%</span>
          <span>
            {value}/{max}
          </span>
        </Typography>
      )}
      <LinearProgress variant='determinate' value={percentage} color={color} />
    </Box>
  );
}
