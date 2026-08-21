import { Box, Typography } from '@mui/material';

export type ListHeaderProps = {
  title: string;
  action?: React.ReactNode;
  divider?: boolean;
};

export function ListHeader({
  title,
  action,
  divider = false,
}: ListHeaderProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2,
        px: 2,
        py: 1.5,
        ...(divider && { borderBottom: 1, borderColor: 'divider' }),
      }}
    >
      <Typography variant='h5'>{title}</Typography>
      {action}
    </Box>
  );
}
