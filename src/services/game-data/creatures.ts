import { createGameDataResourceService, type ApiRequest } from './shared';

export function createCreaturesGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/creatures', request);
}

export const creaturesGameDataService = createCreaturesGameDataService();
