import { Box, Typography } from '@mui/material';
import type { IconType } from 'react-icons/lib';

export const FieldLabel = ({
  icon: Icon,
  label,
  action,
}: {
  icon: IconType;
  label: string;
  action?: React.ReactNode;
}) => (
  <Typography
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: 'var(--mui-palette-text-secondary)',
    }}
  >
    <Icon />
    {label}
    <Box sx={{ flex: 1 }} aria-hidden />
    {action}
  </Typography>
);
