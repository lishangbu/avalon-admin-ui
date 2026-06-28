import { createGameDataResourceService, type ApiRequest } from './shared';

export function createNaturesGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/natures', request);
}

export const naturesGameDataService = createNaturesGameDataService();
