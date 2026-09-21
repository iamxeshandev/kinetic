import { Box, Typography } from '@mui/material';
import { motion } from 'motion/react';

export function ClientSection() {
  return (
    <Box
      sx={{
        textAlign: 'center',
        py: 8,
      }}
    >
      <Typography
        color='textSecondary'
        sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}
      >
        Trusted by Professionals
      </Typography>

      <Box
        sx={{
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        {[false, true].map((ariaHidden, i) => (
          <Box
            key={i}
            aria-hidden={ariaHidden || undefined}
            component={motion.div}
            animate={{ x: [0, '-100%'] }}
            transition={{ ease: 'linear', duration: 10, repeat: Infinity }}
            sx={{
              display: 'flex',
              gap: 16,
              py: 4,
              pr: 16,
            }}
          >
            {clients.map(({ name, logo }, index) => (
              <Box
                key={index}
                component='img'
                src={logo}
                alt={name}
                sx={{ height: 50 }}
              />
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

const clients = [
  {
    name: 'Google',
    logo: 'https://thesvg.org/icons/google/default.svg',
  },
  {
    name: 'Microsoft',
    logo: 'https://thesvg.org/icons/microsoft/default.svg',
  },
  {
    name: 'Slack',
    logo: 'https://thesvg.org/icons/slack/default.svg',
  },
  {
    name: 'Amazon',
    logo: 'https://thesvg.org/icons/amazon/default.svg',
  },
  {
    name: 'Meta',
    logo: 'https://thesvg.org/icons/meta/default.svg',
  },
  {
    name: 'Netflix',
    logo: 'https://thesvg.org/icons/netflix/default.svg',
  },
];
