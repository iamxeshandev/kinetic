import {
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { LuGrid2X2, LuList } from 'react-icons/lu';

type AllProjectsView = 'grid' | 'list';

export function AllProjectsSection() {
  const [view, setView] = useState<AllProjectsView>('grid');

  const handleViewChange = (
    _: React.MouseEvent<HTMLElement>,
    value: AllProjectsView,
  ) => {
    console.log(value);
    setView(value);
  };

  return (
    <>
      <Stack
        direction={'row'}
        spacing={2}
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: 1,
          borderColor: 'divider',
          py: 2,
        }}
      >
        <Typography variant='h4'>All Projects</Typography>

        <ToggleButtonGroup
          aria-label='View'
          size='small'
          exclusive
          value={view}
          onChange={handleViewChange}
        >
          <ToggleButton value='grid'>
            <LuGrid2X2 fontSize={'1rem'} />
          </ToggleButton>
          <ToggleButton value='list'>
            <LuList fontSize={'1rem'} />
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>
    </>
  );
}
