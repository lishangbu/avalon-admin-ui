import { createGameDataResourceService, type ApiRequest } from './shared';

export function createBerryFlavorsGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/berry-flavors', request);
}

export const berryFlavorsGameDataService = createBerryFlavorsGameDataService();
