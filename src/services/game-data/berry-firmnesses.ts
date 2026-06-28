import { createGameDataResourceService, type ApiRequest } from './shared';

export function createBerryFirmnessesGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/berry-firmnesses', request);
}

export const berryFirmnessesGameDataService = createBerryFirmnessesGameDataService();
