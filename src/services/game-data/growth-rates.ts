import { createGameDataResourceService, type ApiRequest } from './shared';

export function createGrowthRatesGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/growth-rates', request);
}

export const growthRatesGameDataService = createGrowthRatesGameDataService();
