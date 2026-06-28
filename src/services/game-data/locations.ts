import { createGameDataResourceService, type ApiRequest } from './shared';

export function createLocationsGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/locations', request);
}

export const locationsGameDataService = createLocationsGameDataService();
