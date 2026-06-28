import { createGameDataResourceService, type ApiRequest } from './shared';

export function createCreatureStatsGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/creature-stats', request);
}

export const creatureStatsGameDataService = createCreatureStatsGameDataService();
