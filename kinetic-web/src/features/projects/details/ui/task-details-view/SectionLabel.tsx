import { Typography } from '@mui/material';
import type { IconType } from 'react-icons/lib';

export const SectionLabel = ({
  icon: Icon,
  label,
}: {
  icon: IconType;
  label: string;
}) => (
  <Typography
    color='textSecondary'
    variant='h5'
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1,
    }}
  >
    <Icon />
    {label}
  </Typography>
);
