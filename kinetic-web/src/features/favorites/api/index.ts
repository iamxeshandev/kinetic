import { api, type ApiResponse } from '../../../shared/api';
import type { FavoriteEntityType } from '../types';

const baseUrl = 'api/favorites';

export const favoritesApi = {
  create: (entityType: FavoriteEntityType, entityId: string) =>
    api.post<ApiResponse<void>>(`${baseUrl}/${entityType}/${entityId}`),

  delete: (entityType: FavoriteEntityType, entityId: string) =>
    api.delete<ApiResponse<void>>(`${baseUrl}/${entityType}/${entityId}`),
};
