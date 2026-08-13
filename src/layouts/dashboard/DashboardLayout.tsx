import { Container } from '@mui/material';
import { useState } from 'react';
import { Outlet } from 'react-router';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';

export function DashboardLayout() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const navbarRef = (node: HTMLElement) => {
    if (node) {
      const { width, height } = node.getBoundingClientRect();
      setSize({ width, height });
    }
  };

  return (
    <>
      <Header sx={{ ml: { xs: 0, sm: `${size.width}px` } }} />
      <Navbar ref={navbarRef} />
      <Container
        component={'main'}
        maxWidth={false}
        sx={{
          p: 3,
          mb: { xs: `${size.height}px`, sm: 0 },
          ml: { xs: 0, sm: `${size.width}px` },
          maxWidth: { xs: '100dvw', sm: `calc(100dvw - ${size.width}px)` },
        }}
      >
        <Outlet />
      </Container>
    </>
  );
}
