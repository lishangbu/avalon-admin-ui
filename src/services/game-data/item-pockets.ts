import { createGameDataResourceService, type ApiRequest } from './shared';

export function createItemPocketsGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/item-pockets', request);
}

export const itemPocketsGameDataService = createItemPocketsGameDataService();
