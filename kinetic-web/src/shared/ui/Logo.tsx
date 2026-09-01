import { Box, Typography, type BoxProps } from '@mui/material';
import { Link as RouterLink, type LinkProps } from 'react-router';
import logoImg from '../../assets/logo.svg';
import { CONFIG } from '../../config';
import { paths } from '../../routes';

export type LogoProps = Omit<BoxProps, 'component'> & {
  isLink?: boolean;
  to?: LinkProps['to'];
  full?: boolean;
};

export function Logo({
  isLink = true,
  to = paths.home.root,
  full = false,
  sx,
  ...props
}: LogoProps) {
  return (
    <Box
      component={isLink ? RouterLink : 'div'}
      to={isLink ? to : undefined}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        textDecoration: 'none',
        color: 'primary.main',
        ...sx,
      }}
      {...props}
    >
      <Box
        component='img'
        src={logoImg}
        alt={CONFIG.APP_NAME}
        sx={{
          width: { xs: 32, sm: 40 },
          height: 'auto',
          display: 'block',
        }}
      />
      {full && <Typography variant='h1'>{CONFIG.APP_NAME}</Typography>}
    </Box>
  );
}
