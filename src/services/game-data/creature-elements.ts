import { createGameDataResourceService, type ApiRequest } from './shared';

export function createCreatureElementsGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/creature-elements', request);
}

export const creatureElementsGameDataService = createCreatureElementsGameDataService();
