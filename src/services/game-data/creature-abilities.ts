import { createGameDataResourceService, type ApiRequest } from './shared';

export function createCreatureAbilitiesGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/creature-abilities', request);
}

export const creatureAbilitiesGameDataService = createCreatureAbilitiesGameDataService();
