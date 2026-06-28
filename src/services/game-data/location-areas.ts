import { createGameDataResourceService, type ApiRequest } from './shared';

export function createLocationAreasGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/location-areas', request);
}

export const locationAreasGameDataService = createLocationAreasGameDataService();
