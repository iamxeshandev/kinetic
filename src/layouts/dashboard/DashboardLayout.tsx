import { Container, useMediaQuery } from '@mui/material';
import { useLayoutEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';

export function DashboardLayout() {
  const navbarRef = useRef<HTMLElement>(null);

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  useLayoutEffect(() => {
    if (navbarRef.current) {
      const { width, height } = navbarRef.current.getBoundingClientRect();
      console.log(width, height);
      setSize({ width, height });
    }
  }, [isMobile]);

  return (
    <>
      <Header sx={{ ml: { xs: 0, sm: `${size.width}px` } }} />
      <Container
        component={'main'}
        maxWidth={false}
        sx={{
          p: 3,
          mb: { xs: `${size.height}px`, sm: 0 },
          ml: { xs: 0, sm: `${size.width}px` },
          maxWidth: { xs: '100svw', sm: `calc(100svw - ${size.width}px)` },
        }}
      >
        <Outlet />
      </Container>
      <Navbar ref={navbarRef} />
    </>
  );
}
