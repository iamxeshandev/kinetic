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
  const renderLogo = (
    <Box
      component={'img'}
      src={logoImg}
      alt='App logo'
      {...props}
      sx={{ width: 50, ...props.sx }}
    />
  );

  const renderLinkLogo = (
    <Link role='link' to={to}>
      {renderLogo}
    </Link>
  );

  return isLink ? renderLinkLogo : renderLogo;
}
