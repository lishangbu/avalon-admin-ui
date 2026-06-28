import { createGameDataResourceService, type ApiRequest } from './shared';

export function createRegionsGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/regions', request);
}

export const regionsGameDataService = createRegionsGameDataService();
