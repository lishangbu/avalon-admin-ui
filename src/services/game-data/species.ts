import { createGameDataResourceService, type ApiRequest } from './shared';

export function createSpeciesGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/species', request);
}

export const speciesGameDataService = createSpeciesGameDataService();
