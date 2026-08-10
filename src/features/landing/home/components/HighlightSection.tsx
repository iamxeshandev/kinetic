import { alpha, Box, Card, CardHeader, Typography } from '@mui/material';
import { motion } from 'motion/react';
import { MdCalendarMonth, MdMessage, MdViewKanban } from 'react-icons/md';

export function HighlightSection() {
  return (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant='h2' sx={{ mb: 2 }}>
          Everything you need, in one place
        </Typography>
        <Typography color='textSecondary'>
          Streamline your workflow with powerful tools designed for modern
          collaboration.
        </Typography>
      </Box>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: 'stretch',
          gap: { xs: 2, md: 4 },
          textAlign: 'start',
          py: 4,
        }}
      >
        {highlights.map(({ title, description, icon }, index) => (
          <Card key={index} sx={{ p: 3 }}>
            <Box
              sx={{
                p: 2,
                bgcolor: (theme) => alpha(theme.palette.primary.light, 0.3),
                display: 'inline-flex',
                borderRadius: 2,
                color: 'primary.main',
                fontSize: 24,
              }}
            >
              {icon}
            </Box>
            <CardHeader title={title} sx={{ px: 0 }} />
            <Typography color='textSecondary'>{description}</Typography>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

const highlights = [
  {
    title: 'Smart Kanban Boards',
    description:
      'Drag-and-drop task management that adapts to your unique workflow.',
    icon: <MdViewKanban />,
  },
  {
    title: 'Integrated Calendar',
    description:
      'Never miss a deadline with synchronized timelines and automated reminders.',
    icon: <MdCalendarMonth />,
  },
  {
    title: 'Real-time Chat',
    description:
      'Instant collaboration and threaded discussions exactly where the work happens.',
    icon: <MdMessage />,
  },
];
