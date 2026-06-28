import { createGameDataResourceService, type ApiRequest } from './shared';

export function createCreatureGameIndicesGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/creature-game-indices', request);
}

export const creatureGameIndicesGameDataService = createCreatureGameIndicesGameDataService();
