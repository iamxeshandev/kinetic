import { Box, LinearProgress, Stack } from '@mui/material';

type SegmentedProgressProps = {
  value: number;
  segments: number;
  max?: number;
};

export function SegmentedProgress({
  value,
  segments,
  max = 10,
}: SegmentedProgressProps) {
  if (segments > max)
    return (
      <LinearProgress
        variant='determinate'
        value={value}
        max={max}
        sx={{ borderRadius: 10 }}
      />
    );

  return (
    <Stack direction={'row'} spacing={0.5}>
      {Array.from({ length: segments }).map((_, index) => (
        <Box
          key={index}
          sx={{
            flex: 1,
            height: 4,
            borderRadius: 10,
            backgroundColor: 'primary.main',
            opacity: index < value ? 1 : 0.5,
          }}
        />
      ))}
    </Stack>
  );
}
