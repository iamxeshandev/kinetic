import { Box, Card, Stack, Typography } from '@mui/material';
import {
  LuChartNoAxesCombined,
  LuCircleCheck,
  LuListTodo,
  LuTriangleAlert,
} from 'react-icons/lu';

export function OverviewSection() {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: 2,
      }}
    >
      {MOCK_STATS.map(({ id, title, icon, value, description }) => (
        <Card key={id} sx={{ p: 2 }}>
          <Stack spacing={1}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant='overline2'>{title}</Typography>
              {icon}
            </Box>

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
      ))}
    </Box>
  );
}

const MOCK_STATS = [
  {
    id: '1',
    title: 'Total Tasks',
    icon: (
      <Box
        component={LuListTodo}
        sx={{ color: 'info.main', fontSize: { xs: 24, md: 36 } }}
      />
    ),
    value: 24,
    description: 'Across 3 active projects',
  },
  {
    id: '2',
    title: 'Completed',
    icon: (
      <Box
        component={LuCircleCheck}
        sx={{ color: 'success.main', fontSize: { xs: 24, md: 36 } }}
      />
    ),
    value: 18,
    description: 'Across 3 active projects',
  },
  {
    id: '3',
    title: 'Overdue',
    icon: (
      <Box
        component={LuTriangleAlert}
        sx={{ color: 'error.main', fontSize: { xs: 24, md: 36 } }}
      />
    ),
    value: 3,
    description: 'Requires immediate attention',
  },
  {
    id: '4',
    title: 'Productivity',
    icon: (
      <Box
        component={LuChartNoAxesCombined}
        sx={{ color: 'warning.main', fontSize: { xs: 24, md: 36 } }}
      />
    ),
    value: 12,
    description: 'Compared to last week',
  },
];
