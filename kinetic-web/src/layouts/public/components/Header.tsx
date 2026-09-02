import { Box, Button, Container, useMediaQuery } from '@mui/material';
import { NavLink } from 'react-router';
import { useAuthContext } from '../../../features/auth/context';
import { paths } from '../../../routes/paths';
import { Logo } from '../../../shared/components/ui/Logo';
import { ThemeSwitcher } from '../../../shared/components/ui/ThemeSwitcher';
import { NavHorizontal, type NavHorizontalProps } from './NavHorizontal';
import { NavMobile, type NavMobileProps } from './NavMobile';

export function Header() {
  const { user } = useAuthContext();

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  return (
    <Box component={'header'} className='glass'>
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

        <ThemeSwitcher />

        {user?.currentWorkspace ? (
          <Button
            component={NavLink}
            to={paths.workspaces.dashboard(user.currentWorkspace.id)}
          >
            Dashboard
          </Button>
        ) : (
          <Button component={NavLink} to={paths.auth.signIn}>
            Sign In
          </Button>
        )}
      </Container>
    </Box>
  );
}

const navLinks: NavHorizontalProps['navLinks'] & NavMobileProps['navLinks'] = [
  { label: 'Home', to: paths.home.root },
  { label: 'About', to: paths.about.root },
  { label: 'Contact', to: paths.contact.root },
];
