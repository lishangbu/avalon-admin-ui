import { createGameDataResourceService, type ApiRequest } from './shared';

export function createGrowthRateLevelsGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/growth-rate-levels', request);
}

export const growthRateLevelsGameDataService = createGrowthRateLevelsGameDataService();
