import { alpha, Box, Button, Container, useMediaQuery } from '@mui/material';
import { NavLink } from 'react-router';
import { Logo } from '../../../components/ui/Logo';
import { ThemeToggle } from '../../../components/ui/ThemeToggle';
import { paths } from '../../../routes/paths';
import { NavHorizontal, type NavHorizontalProps } from './NavHorizontal';
import { NavMobile, type NavMobileProps } from './NavMobile';

export function Header() {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  return (
    <Box
      component={'header'}
      sx={{
        backdropFilter: 'var(--backdrop-filter)',
        backgroundColor: (theme) =>
          alpha(
            theme.palette.background.default,
            theme.palette.action.disabledOpacity,
          ),
      }}
    >
      <Container
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          py: 2,
        }}
      >
        {isMobile && <NavMobile navLinks={navLinks} />}

        <Logo />

        <Box aria-hidden sx={{ flex: 1 }} />

        {!isMobile && <NavHorizontal navLinks={navLinks} />}

        <ThemeToggle />

        <Button component={NavLink} to={paths.auth.signIn}>
          Sign In
        </Button>
      </Container>
    </Box>
  );
}

const navLinks: NavHorizontalProps['navLinks'] & NavMobileProps['navLinks'] = [
  { label: 'Home', to: paths.home.root },
  { label: 'About', to: paths.about.root },
  { label: 'Contact', to: paths.contact.root },
];
