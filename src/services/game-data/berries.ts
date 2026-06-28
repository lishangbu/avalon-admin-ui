import { createGameDataResourceService, type ApiRequest } from './shared';

export function createBerriesGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/berries', request);
}

export const berriesGameDataService = createBerriesGameDataService();
