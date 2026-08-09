import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { motion } from 'motion/react';
import { NavLink } from 'react-router';
import { paths } from '../../../routes/paths';

import heroImg from '../../../assets/hero.svg';

export function HeroSection() {
  return (
    <Grid
      container
      spacing={2}
      sx={{
        flex: 1,
        alignItems: 'center',
        py: 4,
      }}
    >
      <Grid
        component={motion.div}
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        size={{ xs: 12, md: 6 }}
        sx={{ display: 'flex', justifyContent: 'center' }}
      >
        <Stack
          spacing={2}
          sx={{
            maxWidth: 'sm',
            alignItems: { xs: 'center', md: 'start' },
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          <Typography variant='h1'>
            Accelerate Your Team's{' '}
            <Box
              component={'span'}
              sx={{
                background: (theme) =>
                  `linear-gradient(${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Kinetic
            </Box>{' '}
            Energy
          </Typography>
          <Typography color='textSecondary'>
            The all-in-one workspace for modern teams to plan, track, and
            collaborate in real-time.
          </Typography>
          <Button component={NavLink} to={paths.auth.signUp} size='large'>
            Get Started for Free
          </Button>
        </Stack>
      </Grid>

      <Grid
        component={motion.div}
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        size={{ xs: 12, md: 6 }}
        sx={{ display: { xs: 'block', md: 'block' } }}
      >
        <Box component={'img'} src={heroImg} alt='Home' />
      </Grid>
    </Grid>
  );
}
