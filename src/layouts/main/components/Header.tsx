import { Box, Button, Container, useMediaQuery } from '@mui/material';
import { Link, NavLink } from 'react-router';
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
        position: 'sticky',
        top: 0,
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        zIndex: (theme) => theme.zIndex.appBar,
      }}
    >
      <Container
        component={'header'}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          py: 2,
        }}
      >
        {isMobile && <NavMobile navLinks={navLinks} />}

        <Box
          component={Link}
          to={paths.home.root}
          sx={{
            display: 'flex',
            alignItems: 'center',
            mr: 'auto',
          }}
        >
          <Logo />
        </Box>

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
