import { Box, type BoxProps } from '@mui/material';
import { Link, type LinkProps } from 'react-router';
import logoImg from '../../assets/logo.svg';
import { paths } from '../../routes';

export type LogoProps = BoxProps<'img'> & {
  isLink?: boolean;
  to?: LinkProps['to'];
};

export function Logo({
  isLink = true,
  to = paths.home.root,
  ...props
}: LogoProps) {
  return (
    <Box
      component={isLink ? Link : 'div'}
      role='link'
      to={to}
      {...props}
      sx={{ display: 'inline-flex', flexShrink: 0, width: 40, ...props.sx }}
    >
      <Box component={'img'} src={logoImg} alt='App logo' sx={{ width: 1 }} />
    </Box>
  );
}
