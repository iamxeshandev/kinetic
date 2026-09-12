import { api, type ApiResponse } from '../../../../shared/api';
import type { Workspace } from '../../../workspaces/types';
import type { Project } from '../../types';
import type { Section } from '../types';

const baseUrl = (workspaceId: Workspace['id'], projectId: Project['id']) =>
  `api/workspaces/${workspaceId}/projects/${projectId}/sections`;

export const sectionsApi = {
  getAll: (workspaceId: Workspace['id'], projectId: Project['id']) =>
    api
      .get<ApiResponse<Section[]>>(baseUrl(workspaceId, projectId))
      .then((res) => res.data),

  getById: (
    workspaceId: Workspace['id'],
    projectId: Project['id'],
    sectionId: Section['id'],
  ) =>
    api
      .get<
        ApiResponse<Section>
      >(`${baseUrl(workspaceId, projectId)}/${sectionId}`)
      .then((res) => res.data),

  create: (
    workspaceId: Workspace['id'],
    projectId: Project['id'],
    data: Omit<Section, Section['id']>,
  ) =>
    api
      .post<ApiResponse<Section>>(`${baseUrl(workspaceId, projectId)}`, data)
      .then((res) => res.data),

  update: (
    workspaceId: Workspace['id'],
    projectId: Project['id'],
    sectionId: Section['id'],
    data: Omit<Section, Section['id']>,
  ) =>
    api
      .put<
        ApiResponse<Section>
      >(`${baseUrl(workspaceId, projectId)}/${sectionId}`, data)
      .then((res) => res.data),

  delete: (
    workspaceId: Workspace['id'],
    projectId: Project['id'],
    sectionId: Section['id'],
    moveTasksTo?: Section['id'],
    deleteTasks?: boolean,
  ) =>
    api
      .delete<ApiResponse>(
        `${baseUrl(workspaceId, projectId)}/${sectionId}${moveTasksTo ? `?moveTasksTo=${moveTasksTo}` : deleteTasks ? '?deleteTasks=true' : ''}`,
      )
      .then((res) => res.data),

  move: (
    workspaceId: Workspace['id'],
    projectId: Project['id'],
    sectionId: Section['id'],
    previousSectionId?: Section['id'],
    nextSectionId?: Section['id'],
  ) =>
    api
      .patch<ApiResponse>(
        `${baseUrl(workspaceId, projectId)}/${sectionId}/move`,
        {
          previousSectionId,
          nextSectionId,
        },
      )
      .then((res) => res.data),
};

export { baseUrl as sectionsKey };
