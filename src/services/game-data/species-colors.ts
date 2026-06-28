import { createGameDataResourceService, type ApiRequest } from './shared';

export function createSpeciesColorsGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/species-colors', request);
}

export const speciesColorsGameDataService = createSpeciesColorsGameDataService();
