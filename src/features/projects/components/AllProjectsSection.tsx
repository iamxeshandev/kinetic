import {
  Box,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { lazy, Suspense, useState } from 'react';
import { LuGrid2X2, LuList } from 'react-icons/lu';
import { LoadingScreen } from '../../../components/ui/LoadingScreen';
import type { Project } from './ProjectsView';

const ProjectGrid = lazy(() => import('./ProjectGrid'));
const ProjectList = lazy(() => import('./ProjectList'));

export type AllProjectsSectionProps = {
  projects: Project[];
};

export function AllProjectsSection({ projects }: AllProjectsSectionProps) {
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const View = !isMobile && view === 'list' ? ProjectList : ProjectGrid;

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Stack
        direction={'row'}
        spacing={2}
        className='glass'
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: 1,
          borderColor: 'divider',
          py: 2,
        }}
      >
        <Typography variant='h6'>All Projects</Typography>

        <ToggleButtonGroup
          aria-label='View'
          size='small'
          exclusive
          value={view}
          onChange={(_, value) => (value ? setView(value) : undefined)}
          sx={{ display: { xs: 'none', sm: 'inherit' } }}
        >
          <ToggleButton value='grid'>
            <LuGrid2X2 fontSize={'1rem'} />
          </ToggleButton>
          <ToggleButton value='list'>
            <LuList fontSize={'1rem'} />
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      <Suspense fallback={<LoadingScreen />}>
        <View projects={projects} />
      </Suspense>
    </Box>
  );
}
