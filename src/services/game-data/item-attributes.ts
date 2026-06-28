import { createGameDataResourceService, type ApiRequest } from './shared';

export function createItemAttributesGameDataService(request?: ApiRequest) {
  return createGameDataResourceService('/api/game-data/item-attributes', request);
}

export const itemAttributesGameDataService = createItemAttributesGameDataService();
