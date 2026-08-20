export type ProjectStatus = 'all' | 'active' | 'completed';

export type ProjectPriority = 'high' | 'medium' | 'low';

export type Project = {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  dueDate: string;
  team: string[];
  progress: number;
  tasks: number;
  completedTasks: number;
  isFavorite: boolean;
};
