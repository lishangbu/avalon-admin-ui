import { createGameDataResourceService, type ApiRequest } from './shared';

export function createItemGameIndicesGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/item-game-indices', request);
}

export const itemGameIndicesGameDataService = createItemGameIndicesGameDataService();
