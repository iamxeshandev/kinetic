import { Box, Card, Stack, Typography } from '@mui/material';
import {
  LuChartNoAxesCombined,
  LuCircleCheck,
  LuListTodo,
  LuTriangleAlert,
} from 'react-icons/lu';

export function DashboardStat() {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: 2,
      }}
    >
      {MOCK_STATS.map(
        ({ id, title, icon, color: iconColor, value, description }) => (
          <Card key={id} sx={{ p: 2 }}>
            <Stack spacing={1} sx={{ position: 'relative' }}>
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  fontSize: { xs: 24, md: 36 },
                  color: `${iconColor}.light`,
                }}
              >
                {icon}
              </Box>

              <Typography
                sx={{
                  color: 'text.secondary',
                  fontWeight: 'bold',
                  width: 0.8,
                }}
              >
                {title}
              </Typography>

              <Typography sx={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {value}
              </Typography>

              <Typography
                variant='subtitle2'
                sx={{ display: { xs: 'none', md: 'block' } }}
              >
                {description}
              </Typography>
            </Stack>
          </Card>
        ),
      )}
    </Box>
  );
}

const MOCK_STATS = [
  {
    id: '1',
    title: 'Total Tasks',
    icon: <LuListTodo />,
    color: 'info',
    value: 24,
    description: 'Across 3 active projects',
  },
  {
    id: '2',
    title: 'Completed',
    icon: <LuCircleCheck />,
    color: 'success',
    value: 18,
    description: 'Across 3 active projects',
  },
  {
    id: '3',
    title: 'Overdue',
    icon: <LuTriangleAlert />,
    color: 'error',
    value: 3,
    description: 'Requires immediate attention',
  },
  {
    id: '4',
    title: 'Productivity',
    icon: <LuChartNoAxesCombined />,
    color: 'warning',
    value: 12,
    description: 'Compared to last week',
  },
];
