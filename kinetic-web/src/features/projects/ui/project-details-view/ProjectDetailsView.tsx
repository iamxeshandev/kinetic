import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Box,
  Breadcrumbs,
  Button,
  Link,
  Paper,
  Stack,
  Tab,
  Typography,
} from '@mui/material';
import type { IconType } from 'react-icons/lib';
import { NavLink, useParams, useSearchParams } from 'react-router';
import { paths } from '../../../../routes';
import {
  AddIcon,
  AnalyticsIcon,
  FilesIcon,
  FilterIcon,
  KanbanIcon,
  ListIcon,
  TimelineIcon,
} from '../../../../shared/components/icons';
import { StyledIcon } from '../../../../shared/components/icons/StyledIcon';
import { varAlpha } from '../../../../shared/helpers';
import type { Project } from '../../types';
import { AnalyticsView } from './analytics-view/AnalyticsView';
import { FilesView } from './files-view/FilesView';
import { KanbanView } from './kanban-view/KanbanView';
import { ListView } from './list-view/ListView';
import { TimelineView } from './timeline-view/TimelineView';

type Tab = 'board' | 'list' | 'timeline' | 'files' | 'analytics';

const TABS: Array<{ value: Tab; label: string; icon: IconType }> = [
  { value: 'board', label: 'Board', icon: KanbanIcon },
  { value: 'list', label: 'List', icon: ListIcon },
  { value: 'timeline', label: 'Timeline', icon: TimelineIcon },
  { value: 'files', label: 'Files', icon: FilesIcon },
  { value: 'analytics', label: 'Analytics', icon: AnalyticsIcon },
] as const;

export type ProjectDetailsViewProps = {
  project: Project;
};

export function ProjectDetailsView({ project }: ProjectDetailsViewProps) {
  const { workspaceId } = useParams();

  const [searchParams, setSearchParams] = useSearchParams();

  const view = searchParams.get('view') ?? 'board';

  const activeTab = TABS.some((tab) => tab.value === view) ? view : 'board';

  return (
    <Stack spacing={3} sx={{ flex: 1 }}>
      {/* Header */}
      <Stack spacing={1}>
        <Breadcrumbs>
          <Link
            component={NavLink}
            to={paths.workspaces.projects.root(workspaceId!)}
          >
            Projects
          </Link>
          <Typography>{project.name}</Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant='h2' sx={{ flex: 1 }}>
            {project.name}
          </Typography>

          <Button startIcon={<AddIcon />}>Create Task</Button>
        </Box>
      </Stack>

      {/* Tabs */}
      <TabContext value={activeTab}>
        <Box
          component={Paper}
          sx={{
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            p: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <TabList
            onChange={(_, value) => setSearchParams({ view: value })}
            sx={{ minHeight: 0 }}
            slotProps={{
              list: { sx: { gap: 1 } },
              indicator: { sx: { display: 'none' } },
            }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                icon={<StyledIcon icon={tab.icon} size='small' />}
                iconPosition='start'
                sx={{
                  minHeight: 0,
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: 'var(--mui-palette-action-hover)',
                  },
                  '&.Mui-selected': {
                    backgroundColor: (theme) =>
                      varAlpha(
                        theme.vars!.palette.primary.mainChannel,
                        theme.vars!.palette.action.selectedOpacity,
                      ),
                  },
                }}
              />
            ))}
          </TabList>

          <Box sx={{ flex: 1 }} aria-hidden />

          <Button variant='secondary' startIcon={<FilterIcon />}>
            Filter
          </Button>
        </Box>

        <TabPanel value='board' sx={{ p: 0, flex: 1 }}>
          <KanbanView />
        </TabPanel>

        <TabPanel value='list' sx={{ p: 0, flex: 1 }}>
          <ListView />
        </TabPanel>

        <TabPanel value='timeline' sx={{ p: 0, flex: 1 }}>
          <TimelineView />
        </TabPanel>

        <TabPanel value='files' sx={{ p: 0, flex: 1 }}>
          <FilesView />
        </TabPanel>

        <TabPanel value='analytics' sx={{ p: 0, flex: 1 }}>
          <AnalyticsView />
        </TabPanel>
      </TabContext>
    </Stack>
  );
}
