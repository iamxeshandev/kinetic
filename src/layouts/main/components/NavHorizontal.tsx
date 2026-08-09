import { Box, Link } from '@mui/material';
import { NavLink } from 'react-router';

export type NavHorizontalProps = {
  navLinks: Array<{ label: string; to: string }>;
};

export function NavHorizontal({ navLinks }: NavHorizontalProps) {
  return (
    <Box
      component={'nav'}
      sx={{ display: 'flex', gap: 2, alignItems: 'center' }}
    >
      {navLinks.map(({ label, to }, index) => (
        <Link key={index} component={NavLink} to={to}>
          {label}
        </Link>
      ))}
    </Box>
  );
}
