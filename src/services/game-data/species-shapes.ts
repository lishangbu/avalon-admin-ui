import { createGameDataResourceService, type ApiRequest } from './shared';

export function createSpeciesShapesGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/species-shapes', request);
}

export const speciesShapesGameDataService = createSpeciesShapesGameDataService();
