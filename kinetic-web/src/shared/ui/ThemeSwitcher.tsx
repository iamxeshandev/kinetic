import {
  IconButton,
  useColorScheme,
  type IconButtonProps,
} from '@mui/material';
import { LuContrast, LuMoon, LuSun } from 'react-icons/lu';

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
  system: <LuContrast />,
  light: <LuSun />,
  dark: <LuMoon />,
};
