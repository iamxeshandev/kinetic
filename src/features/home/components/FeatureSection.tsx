import { Box, Grid, Stack, Typography } from '@mui/material';
import { motion } from 'motion/react';
import { MdCheckCircle } from 'react-icons/md';

export function FeatureSection() {
  return (
    <Grid container spacing={4} sx={{ py: 4, alignItems: 'center' }}>
      <Grid
        component={motion.div}
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, margin: '-100px' }}
        size={{ xs: 12, md: 6 }}
        sx={{ display: { xs: 'none', md: 'block' } }}
      >
        <Box component={'img'} src='src\assets\features.svg' alt='Features' />
      </Grid>
      <Grid
        component={motion.div}
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        size={{ xs: 12, md: 6 }}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <Typography variant='h2'>Beyond Simple Task Management</Typography>
        <Typography color='textSecondary'>
          Scale your operations with advanced features designed for complex
          projects.
        </Typography>
        <Stack spacing={1}>
          {features.map(({ title, description }, index) => (
            <Box
              key={index}
              sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
            >
              <Box sx={{ color: 'primary.main' }}>
                <MdCheckCircle fontSize={20} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 'bold' }}>{title}</Typography>
                <Typography color='textSecondary'>{description}</Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </Grid>
    </Grid>
  );
}

const features = [
  {
    title: 'Infinite Subtasks',
    description:
      'Break down massive projects into manageable, assignable pieces.',
  },
  {
    title: 'Secure File Sharing',
    description:
      'Attach assets directly to tasks with enterprise-grade encryption.',
  },
  {
    title: 'Workload Management',
    description:
      'Visualize team capacity and prevent burnout before it happens.',
  },
];
