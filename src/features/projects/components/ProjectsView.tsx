import { Stack } from '@mui/material';
import { useState } from 'react';
import { AllProjectsSection } from './AllProjectsSection';
import { FavoriteSection } from './FavoriteSection';
import { HeaderSection } from './HeaderSection';

export type ProjectStatus = 'all' | 'active' | 'completed';

export type Priority = 'high' | 'medium' | 'low';

export function ProjectsView() {
  const [projects, setProjects] = useState<Project[]>(PROJECTS);

  const handleFavoriteClick = (projectId: number) => {
    setProjects((projects) =>
      projects.map((p) =>
        p.id === projectId ? { ...p, isFavorite: !p.isFavorite } : p,
      ),
    );
  };

  const handleProjectClick = () => {};

  const favoriteProjects = projects.filter((p) => p.isFavorite);

  return (
    <Stack spacing={3} sx={{ flex: 1 }}>
      <HeaderSection />
      <FavoriteSection
        favoriteProjects={favoriteProjects}
        onFavoriteClick={handleFavoriteClick}
        onProjectClick={handleProjectClick}
        actions={[]}
      />
      <AllProjectsSection
        projects={projects}
        onFavoriteClick={handleFavoriteClick}
        onProjectClick={handleProjectClick}
        actions={[]}
      />
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
  isFavorite: boolean;
};

const PROJECTS: Project[] = [
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
    isFavorite: true,
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
    isFavorite: true,
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
    isFavorite: false,
  },
];
