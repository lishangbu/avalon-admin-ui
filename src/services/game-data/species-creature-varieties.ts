import { createGameDataResourceService, type ApiRequest } from './shared';

export function createSpeciesCreatureVarietiesGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/species-creature-varieties', request);
}

export const speciesCreatureVarietiesGameDataService =
  createSpeciesCreatureVarietiesGameDataService();
