import { createGameDataResourceService, type ApiRequest } from './shared';

export function createStatsGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/stats', request);
}

export const statsGameDataService = createStatsGameDataService();
