import { api } from '../../../../shared/api';
import type { components } from '../../../../shared/api/types';
import type { Workspace } from '../../../workspaces/types/workspace';
import type { Project } from '../../types';
import type { Section } from '../types';

const baseUrl = (workspaceId: Workspace['id'], projectId: Project['id']) =>
  `api/workspaces/${workspaceId}/projects/${projectId}/sections`;

export const sectionsApi = {
  getAll: (workspaceId: Workspace['id'], projectId: Project['id']) =>
    api
      .get<components['schemas']['ResponseOfListOfSectionDto']>(
        baseUrl(workspaceId, projectId),
      )
      .then((res) => res.data),

  getById: (
    workspaceId: Workspace['id'],
    projectId: Project['id'],
    sectionId: Section['id'],
  ) =>
    api
      .get<components['schemas']['ResponseOfSectionDto']>(
        `${baseUrl(workspaceId, projectId)}/${sectionId}`,
      )
      .then((res) => res.data),

  create: (
    workspaceId: Workspace['id'],
    projectId: Project['id'],
    data: Omit<Section, Section['id']>,
  ) =>
    api
      .post<components['schemas']['ResponseOfSectionDto']>(
        `${baseUrl(workspaceId, projectId)}`,
        data,
      )
      .then((res) => res.data),

  update: (
    workspaceId: Workspace['id'],
    projectId: Project['id'],
    sectionId: Section['id'],
    data: Omit<Section, Section['id']>,
  ) =>
    api
      .put<components['schemas']['ResponseOfSectionDto']>(
        `${baseUrl(workspaceId, projectId)}/${sectionId}`,
        data,
      )
      .then((res) => res.data),

  move: (
    workspaceId: Workspace['id'],
    projectId: Project['id'],
    sectionId: Section['id'],
    data: { previousSectionId?: Section['id']; nextSectionId?: Section['id'] },
  ) =>
    api
      .patch<components['schemas']['Response']>(
        `${baseUrl(workspaceId, projectId)}/${sectionId}/move`,
        data,
      )
      .then((res) => res.data),

  delete: (
    workspaceId: Workspace['id'],
    projectId: Project['id'],
    sectionId: Section['id'],
    moveTasksTo?: Section['id'],
    deleteTasks?: boolean,
  ) =>
    api
      .delete<components['schemas']['Response']>(
        `${baseUrl(workspaceId, projectId)}/${sectionId}${
          moveTasksTo
            ? `?moveTasksTo=${moveTasksTo}`
            : deleteTasks
            ? '?deleteTasks=true'
            : ''
        }`,
      )
      .then((res) => res.data),
};

export { baseUrl as sectionsKey };
