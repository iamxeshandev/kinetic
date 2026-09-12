import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Box,
  Breadcrumbs,
  Button,
  Link,
  Tab as MuiTab,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import type { IconType } from 'react-icons/lib';
import { NavLink, useParams, useSearchParams } from 'react-router';
import { paths } from '../../../../routes';
import {
  AddIcon,
  AnalyticsIcon,
  FilesIcon,
  KanbanIcon,
  ListIcon,
  TimelineIcon,
} from '../../../../shared/icons';
import { StyledIcon } from '../../../../shared/icons/StyledIcon';
import { varAlpha } from '../../../../shared/helpers';
import type { Project } from '../../types';
import { AnalyticsView } from './analytics-view/AnalyticsView';
import { FilesView } from './files-view/FilesView';
import KanbanView from './kanban-view/KanbanView';
import { ListView } from './list-view/ListView';
import { TimelineView } from './timeline-view/TimelineView';

type Tab = {
  value: 'board' | 'list' | 'timeline' | 'files' | 'analytics';
  label: 'Board' | 'List' | 'Timeline' | 'Files' | 'Analytics';
  icon: IconType;
};

const TABS: Array<Tab> = [
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
    <Stack spacing={2} sx={{ flex: 1 }}>
      <TabContext value={activeTab}>
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

            <TabList
              onChange={(_, value) => setSearchParams({ view: value })}
              sx={{
                minHeight: 0,
                borderRadius: 1,
                backgroundColor: 'surface.subtle',
                border: 1,
                borderColor: 'divider',
                p: 0.5,
              }}
              slotProps={{
                list: { sx: { gap: 1 } },
                indicator: { sx: { display: 'none' } },
              }}
            >
              {TABS.map((tab) => (
                <StyledTab
                  key={tab.value}
                  value={tab.value}
                  label={tab.label}
                  icon={<StyledIcon icon={tab.icon} size='small' />}
                  iconPosition='start'
                />
              ))}
            </TabList>

            <Button size='large' startIcon={<AddIcon />}>
              Create Task
            </Button>
          </Box>
        </Stack>

        <StyledTabPanel
          value='board'
          sx={{ overflowX: 'auto', flex: 1, display: 'flex' }}
        >
          <KanbanView />
        </StyledTabPanel>

        <StyledTabPanel value='list'>
          <ListView />
        </StyledTabPanel>

        <StyledTabPanel value='timeline'>
          <TimelineView />
        </StyledTabPanel>

        <StyledTabPanel value='files'>
          <FilesView />
        </StyledTabPanel>

        <StyledTabPanel value='analytics'>
          <AnalyticsView />
        </StyledTabPanel>
      </TabContext>
    </Stack>
  );
}

const StyledTab = styled(MuiTab)(({ theme }) => ({
  minHeight: 0,
  borderRadius: theme.vars!.shape.borderRadius,
  '&:hover': {
    backgroundColor: 'var(--mui-palette-action-hover)',
  },
  '&.Mui-selected': {
    backgroundColor: varAlpha(
      theme.vars!.palette.primary.mainChannel,
      theme.vars!.palette.action.selectedOpacity,
    ),
  },
}));

const StyledTabPanel = styled(TabPanel)(() => ({
  padding: 0,

  '&[hidden]': {
    display: 'none',
  },
}));
