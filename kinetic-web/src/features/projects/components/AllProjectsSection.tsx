import {
  Box,
  Divider,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { lazy, Suspense } from 'react';
import { LuGrid2X2, LuList } from 'react-icons/lu';
import { LoadingScreen } from '../../../components/ui';
import { useLocalStorage } from '../../../utils/hooks';
import type { Project } from '../types/project.types';

const ProjectGrid = lazy(() => import('./ProjectGridView'));
const ProjectList = lazy(() => import('./ProjectListView'));

export type AllProjectSectionProps = {
  projects: Project[];
  onFavoriteClick: (projectId: Project['id']) => void;
  onOpenProjectClick: (projectId: Project['id']) => void;
  onMoreClick: (
    event: React.MouseEvent<HTMLButtonElement>,
    projectId: Project['id'],
  ) => void;
};

export function AllProjectsSection({
  projects,
  onFavoriteClick,
  onOpenProjectClick,
  onMoreClick,
}: AllProjectSectionProps) {
  const [view, setView] = useLocalStorage<'grid' | 'list'>(
    `projects.view`,
    'grid',
  );

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
        }}
      >
        <Typography variant='overline1'>All Projects</Typography>

        <ToggleButtonGroup
          aria-label='View'
          size='small'
          exclusive
          value={view}
          onChange={(_, value) => (value ? setView(value) : undefined)}
          sx={{ display: { xs: 'none', sm: 'inherit' } }}
        >
          <ToggleButton value='grid'>
            <LuGrid2X2 />
          </ToggleButton>
          <ToggleButton value='list'>
            <LuList />
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Suspense fallback={<LoadingScreen />}>
        <View
          projects={projects}
          onFavoriteClick={onFavoriteClick}
          onOpenProjectClick={onOpenProjectClick}
          onMoreClick={onMoreClick}
        />
      </Suspense>
    </Box>
  );
}
