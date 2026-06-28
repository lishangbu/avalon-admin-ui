import { createGameDataResourceService, type ApiRequest } from './shared';

export function createCatalogEntriesGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/catalog-entries', request);
}

export const catalogEntriesGameDataService = createCatalogEntriesGameDataService();
