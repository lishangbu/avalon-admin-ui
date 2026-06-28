import { createGameDataResourceService, type ApiRequest } from './shared';

export function createSpeciesCatalogNumbersGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/species-catalog-numbers', request);
}

export const speciesCatalogNumbersGameDataService = createSpeciesCatalogNumbersGameDataService();
