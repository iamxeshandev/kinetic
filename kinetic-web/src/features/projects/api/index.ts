import { api } from '../../../shared/api';
import type { components } from '../../../shared/api/types';
import type { Project } from '../types';

const baseUrl = (workspaceId: string) =>
  `api/workspaces/${workspaceId}/projects`;

export const projectsApi = {
  getAll: (workspaceId: string) =>
    api
      .get<components['schemas']['ResponseOfListOfProjectDto']>(
        baseUrl(workspaceId),
      )
      .then((res) => res.data),

  getById: (workspaceId: string, projectId: Project['id']) =>
    api
      .get<components['schemas']['ResponseOfProjectDto']>(
        `${baseUrl(workspaceId)}/${projectId}`,
      )
      .then((res) => res.data),

  create: (workspaceId: string, data: Omit<Project, 'id'>) =>
    api
      .post<components['schemas']['ResponseOfProjectDto']>(
        `${baseUrl(workspaceId)}`,
        data,
      )
      .then((res) => res.data),

  update: (
    workspaceId: string,
    projectId: Project['id'],
    data: Omit<Project, 'id'>,
  ) =>
    api
      .put<components['schemas']['ResponseOfProjectDto']>(
        `${baseUrl(workspaceId)}/${projectId}`,
        data,
      )
      .then((res) => res.data),

  delete: (workspaceId: string, projectId: Project['id']) =>
    api
      .delete<components['schemas']['Response']>(
        `${baseUrl(workspaceId)}/${projectId}`,
      )
      .then((res) => res.data),

  getProjectMembers: (workspaceId: string, projectId: Project['id']) =>
    api
      .get<components['schemas']['ResponseOfListOfProjectMemberDto']>(
        `${baseUrl(workspaceId)}/${projectId}/members`,
      )
      .then((res) => res.data),
};

export { baseUrl as projectsKey };
