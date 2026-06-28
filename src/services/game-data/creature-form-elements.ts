import { createGameDataResourceService, type ApiRequest } from './shared';

export function createCreatureFormElementsGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/creature-form-elements', request);
}

export const creatureFormElementsGameDataService = createCreatureFormElementsGameDataService();
