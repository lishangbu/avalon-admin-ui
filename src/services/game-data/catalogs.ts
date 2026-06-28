import { createGameDataResourceService, type ApiRequest } from './shared';

export function createCatalogsGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/catalogs', request);
}

export const catalogsGameDataService = createCatalogsGameDataService();
