import { Typography } from '@mui/material';
import type { IconType } from 'react-icons/lib';

export const GridFieldLabel = ({
  icon: Icon,
  label,
}: {
  icon: IconType;
  label: string;
}) => (
  <Typography
    color='textSecondary'
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      fontWeight: 'bold',
    }}
  >
    <Icon strokeWidth={2.5} />
    {label}
  </Typography>
);
