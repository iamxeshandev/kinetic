import { IconButton, Tooltip, useColorScheme } from '@mui/material';
import { LuContrast, LuMoon, LuSun } from 'react-icons/lu';

export const THEME_ICONS = {
  system: <LuContrast />,
  light: <LuSun />,
  dark: <LuMoon />,
};

export function ThemeSwitcher() {
  const { mode, setMode } = useColorScheme();

  const handleClick = () =>
    setMode(mode === 'system' ? 'light' : mode === 'light' ? 'dark' : 'system');

  return (
    <Tooltip title='Toggle theme'>
      <IconButton onClick={handleClick}>
        {THEME_ICONS[mode ?? 'system']}
      </IconButton>
    </Tooltip>
  );
}
