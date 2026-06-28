import { createGameDataResourceService, type ApiRequest } from './shared';

export function createLocationGameIndicesGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/location-game-indices', request);
}

export const locationGameIndicesGameDataService = createLocationGameIndicesGameDataService();
