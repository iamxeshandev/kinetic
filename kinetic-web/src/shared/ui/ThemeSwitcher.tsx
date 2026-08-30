import {
  IconButton,
  useColorScheme,
  type IconButtonProps,
} from '@mui/material';
import { ContrastIcon, MoonIcon, SunIcon } from '../icons';

export function ThemeSwitcher(props: IconButtonProps) {
  const { mode, setMode } = useColorScheme();

  const handleClick = () =>
    setMode(mode === 'system' ? 'light' : mode === 'light' ? 'dark' : 'system');

  return (
    <IconButton onClick={handleClick} aria-label='Theme Switcher' {...props}>
      {THEME_ICONS[mode ?? 'system']}
    </IconButton>
  );
}

const THEME_ICONS = {
  system: <ContrastIcon />,
  light: <SunIcon />,
  dark: <MoonIcon />,
};
