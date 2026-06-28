import { createGameDataResourceService, type ApiRequest } from './shared';

export function createSpeciesEggGroupsGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/species-egg-groups', request);
}

export const speciesEggGroupsGameDataService = createSpeciesEggGroupsGameDataService();
