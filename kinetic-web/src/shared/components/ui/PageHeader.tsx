import { Box, Typography } from '@mui/material';

export type PageHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
};

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 3,
      }}
    >
      <Box>
        <Typography variant='h1'>{title}</Typography>
        <Typography variant='subtitle1'>{subtitle}</Typography>
      </Box>

      {actions}
    </Box>
  );
}
