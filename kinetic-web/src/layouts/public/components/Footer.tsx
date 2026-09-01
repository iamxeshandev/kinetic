import { Container, Grid, Link, Paper, Typography } from '@mui/material';
import { NavLink } from 'react-router';
import { CONFIG } from '../../../config';
import { paths } from '../../../routes/paths';

export function Footer() {
  return (
    <Paper component={'footer'} elevation={10}>
      <Container component={Grid} container spacing={4} sx={{ py: 8 }}>
        <Grid size={{ xs: 12, md: 4.5 }}>
          <Typography variant='h5' sx={{ mb: 2 }}>
            {CONFIG.APP_NAME}
          </Typography>
          <Typography>
            &copy; {new Date().getFullYear()} {CONFIG.APP_NAME}, All rights
            reserved.
          </Typography>
        </Grid>
        {links.map(({ heading, links }, index) => (
          <Grid
            key={index}
            size={{ xs: 12, md: 2.5 }}
            sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
          >
            <Typography color='textSecondary' sx={{ fontWeight: 'bold' }}>
              {heading}
            </Typography>
            {links.map(({ label, to }, index) => (
              <Link key={index} component={NavLink} to={to}>
                {label}
              </Link>
            ))}
          </Grid>
        ))}
      </Container>
    </Paper>
  );
}

const links = [
  {
    heading: 'Company',
    links: [
      { label: 'About', to: paths.about.root },
      { label: 'Contact', to: paths.contact.root },
      { label: 'Blog', to: '' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Features', to: '' },
      { label: 'Pricing', to: '' },
      { label: 'Support', to: '' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '' },
      { label: 'Terms of Service', to: '' },
      { label: 'Cookie Policy', to: '' },
    ],
  },
];
