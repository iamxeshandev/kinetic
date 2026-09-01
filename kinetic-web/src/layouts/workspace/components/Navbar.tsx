import { useMediaQuery } from '@mui/material';
import { forwardRef } from 'react';
import { NavDesktop, type NavDesktopProps } from './NavDesktop';
import { NavMobile, type NavMobileProps } from './NavMobile';

export type NavbarProps = {
  navLinks: NavDesktopProps['navLinks'] & NavMobileProps['navLinks'];
};

export const Navbar = forwardRef(
  ({ navLinks }: NavbarProps, ref: React.Ref<HTMLElement>) => {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    return isMobile ? (
      <NavMobile ref={ref} navLinks={navLinks} />
    ) : (
      <NavDesktop ref={ref} navLinks={navLinks} />
    );
  },
);
