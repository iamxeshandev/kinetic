import { Box, Button, Typography } from '@mui/material';
import { motion } from 'motion/react';
import { NavLink } from 'react-router';
import { paths } from '../../../routes/paths';

export function AdvertisementSection() {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        py: 4,
        mb: 4,
      }}
    >
      <Typography variant='h2'>Ready to transform your workflow?</Typography>
      <Typography color='textSecondary'>
        Join thousands of teams already using Kinetic Enterprise to do their
        best work.
      </Typography>
      <Button component={NavLink} to={paths.auth.signUp} size='large'>
        Start Free Trial
      </Button>
    </Box>
  );
}
