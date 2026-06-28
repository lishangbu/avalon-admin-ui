import { createGameDataResourceService, type ApiRequest } from './shared';

export function createItemsGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/items', request);
}

export const itemsGameDataService = createItemsGameDataService();
