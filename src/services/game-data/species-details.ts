import { createGameDataResourceService, type ApiRequest } from './shared';

export function createSpeciesDetailsGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/species-details', request);
}

export const speciesDetailsGameDataService = createSpeciesDetailsGameDataService();
