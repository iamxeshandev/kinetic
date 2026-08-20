import type { Project } from '../types/types';

export const PROJECTS: Project[] = [
  {
    id: '1',
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
    id: '2',
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
    id: '3',
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
