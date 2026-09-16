import { api } from '../../../shared/api';
import type { components } from '../../../shared/api/types';
import type { FavoriteEntityType } from '../types';

const baseUrl = 'api/favorites';

export const favoritesApi = {
  create: (entityType: FavoriteEntityType, entityId: string) =>
    api.post<components['schemas']['Response']>(
      `${baseUrl}/${entityType}/${entityId}`,
    ),

  delete: (entityType: FavoriteEntityType, entityId: string) =>
    api.delete<components['schemas']['Response']>(
      `${baseUrl}/${entityType}/${entityId}`,
    ),
};
