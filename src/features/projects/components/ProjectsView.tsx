import { Stack } from '@mui/material';
import { AllProjectsSection } from './AllProjectsSection';
import { HeaderSection } from './HeaderSection';
import { StarredAndRecentSection } from './StarredAndRecentSection';

export type ProjectStatus = 'all' | 'active' | 'completed';

export type Priority = 'high' | 'medium' | 'low';

export function ProjectsView() {
  return (
    <Stack spacing={3} sx={{ flex: 1 }}>
      <HeaderSection />
      <StarredAndRecentSection projects={projects} />
      <AllProjectsSection projects={projects} />
    </Stack>
  );
}

export type Project = {
  id: number;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: Priority;
  dueDate: string;
  team: string[];
  progress: number;
  tasks: number;
  completedTasks: number;
  isStarred: boolean;
};

const projects: Project[] = [
  {
    id: 1,
    name: 'E-Commerce Platform Redesign',
    description:
      'Complete overhaul of the online store with modern UI/UX and improved checkout flow.',
    status: 'active',
    priority: 'high',
    dueDate: '2026-08-15',
    team: ['John Doe', 'Jane Smith', 'Mike Johnson'],
    progress: 75,
    tasks: 24,
    completedTasks: 18,
    isStarred: true,
  },
  {
    id: 2,
    name: 'Mobile App Development',
    description:
      'Native mobile app for iOS and Android with offline capabilities and push notifications.',
    status: 'completed',
    priority: 'medium',
    dueDate: '2026-06-30',
    team: ['Sarah Wilson', 'Tom Brown', 'Emily Davis'],
    progress: 100,
    tasks: 32,
    completedTasks: 32,
    isStarred: true,
  },
  {
    id: 3,
    name: 'AI Chatbot Integration',
    description:
      'Implement AI-powered customer support chatbot with natural language processing.',
    status: 'active',
    priority: 'low',
    dueDate: '2026-10-01',
    team: ['Alex Chen', 'Maria Garcia'],
    progress: 40,
    tasks: 15,
    completedTasks: 6,
    isStarred: false,
  },
];
