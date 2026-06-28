import { createGameDataResourceService, type ApiRequest } from './shared';

export function createCreatureHeldItemsGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/creature-held-items', request);
}

export const creatureHeldItemsGameDataService = createCreatureHeldItemsGameDataService();
