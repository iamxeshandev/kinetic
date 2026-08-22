import { api } from '../../../utils/axios';
import type { Project } from '../types/types';

const BASE_URL = 'projects';

export const projectsApi = {
  getAll: () => api.get<Project[]>(BASE_URL),
  getById: (id: string) => api.get<Project>(`${BASE_URL}/${id}`),
  create: (data: object) => api.post<Project>(BASE_URL, data),
  update: (id: string, data: object) =>
    api.put<Project>(`${BASE_URL}/${id}`, data),
  delete: (id: string) => api.delete<null>(`${BASE_URL}/${id}`),
};

export const PROJECTS_KEY = BASE_URL;
