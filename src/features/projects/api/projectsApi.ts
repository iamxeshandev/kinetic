import { api } from '../../../utils/axios';
import type { Project } from '../types/types';

const BASE = 'projects';

export const projectsApi = {
  getAll: () => api.get<Project[]>(BASE),
  getById: (id: string) => api.get<Project>(`${BASE}/${id}`),
  create: (data: object) => api.post<Project>(BASE, data),
  update: (id: string, data: object) => api.put<Project>(`${BASE}/${id}`, data),
  delete: (id: string) => api.delete<null>(`${BASE}/${id}`),
};

export const PROJECTS_KEY = BASE;
