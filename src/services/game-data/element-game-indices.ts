import { createGameDataResourceService, type ApiRequest } from './shared';

export function createElementGameIndicesGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/element-game-indices', request);
}

export const elementGameIndicesGameDataService = createElementGameIndicesGameDataService();
