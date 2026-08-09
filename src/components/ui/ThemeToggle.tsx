import { ToggleButton, ToggleButtonGroup, useColorScheme } from '@mui/material';
import { LuMoon, LuSun } from 'react-icons/lu';
import { MdContrast } from 'react-icons/md';

export function ThemeToggle() {
  const { mode, setMode } = useColorScheme();

  return (
    <ToggleButtonGroup
      value={mode}
      onChange={(_, newMode) => setMode(newMode)}
      aria-label='mode'
      exclusive
      size='small'
      sx={{
        borderRadius: 10,
        overflow: 'hidden',
        '& .MuiToggleButton-root:first-of-type': {
          borderTopLeftRadius: '40px',
          borderBottomLeftRadius: '40px',
        },
        '& .MuiToggleButton-root:last-of-type': {
          borderTopRightRadius: '40px',
          borderBottomRightRadius: '40px',
        },
      }}
    >
      <ToggleButton value='light' aria-label='Light mode'>
        <LuSun fontSize={20} />
      </ToggleButton>
      <ToggleButton value='system' aria-label='System theme'>
        <MdContrast fontSize={20} />
      </ToggleButton>
      <ToggleButton value='dark' aria-label='Dark mode'>
        <LuMoon fontSize={20} />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
