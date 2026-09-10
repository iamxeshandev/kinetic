import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Button, Paper, styled, Tab } from '@mui/material';
import type { IconType } from 'react-icons/lib';
import { useSearchParams } from 'react-router';
import {
  AnalyticsIcon,
  FilesIcon,
  FilterIcon,
  KanbanIcon,
  ListIcon,
  TimelineIcon,
} from '../../../../shared/components/icons';
import { StyledIcon } from '../../../../shared/components/icons/StyledIcon';
import { varAlpha } from '../../../../shared/helpers';
import { AnalyticsView } from './analytics-view/AnalyticsView';
import { FilesView } from './files-view/FilesView';
import KanbanView from './kanban-view/KanbanView';
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

export function MainSection() {
  const [searchParams, setSearchParams] = useSearchParams();

  const view = searchParams.get('view') ?? 'board';

  const activeTab = TABS.some((tab) => tab.value === view) ? view : 'board';

  return (
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

      <StyledTabPanel value='board' sx={{ overflowX: 'auto', flex: 1 }}>
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
  );
}

const StyledTabPanel = styled(TabPanel)(() => ({
  padding: 0,

  '&[hidden]': {
    display: 'none',
  },
}));
