import { Container } from '@mui/material';
import type { PropsWithChildren } from 'react';
import { useParams } from 'react-router';
import { useAuthContext } from '../../features/auth/context';
import { useResizeObserver } from '../../shared/hooks';
import { Header } from './components/Header';
import { NavbarDesktop } from './components/NavbarDesktop';
import { NavbarMobile } from './components/NavbarMobile';
import { createNavLinks } from './helpers/create-nav-links';

export function WorkspaceLayout({ children }: PropsWithChildren) {
  const { workspaceId } = useParams();

  const { user } = useAuthContext();

  const { ref: navbarDesktopRef, width } = useResizeObserver();
  const { ref: navbarMobileRef, height } = useResizeObserver();

  const navLinks = createNavLinks(
    workspaceId!,
    user!.currentWorkspace!.isPersonal,
  );

  return (
    <>
      <Header sx={{ ml: { xs: 0, sm: `${width}px` } }} />

      <NavbarDesktop ref={navbarDesktopRef} navLinks={navLinks} />

      <Container
        component={'main'}
        maxWidth={false}
        sx={{
          p: 2,
          overflowX: 'hidden',
          width: { xs: 1, sm: `calc(100% - ${width}px)` },
          ml: { xs: 0, sm: `${width}px` },
          mb: { xs: `${height}px`, sm: 0 },
        }}
      >
        {children}
      </Container>

      <NavbarMobile ref={navbarMobileRef} navLinks={navLinks} />
    </>
  );
}
